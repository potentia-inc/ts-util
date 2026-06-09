import { type Duration, toMs } from './duration.js'

// A generic, transport-agnostic outbound dispatcher. It collects items pushed to
// it and hands them to `send` in batches, applying debounce, rate-limiting,
// retry, a bounded queue and graceful flushing — none of which know anything
// about HTTP, logging, or any specific service.
//
// The `send` callback is where transport lives (an HTTP POST, a WebSocket write,
// ...). It may hold state (a connection handle) in its own closure; the
// dispatcher only ever sees `send(items) => Promise<void>` and treats it as
// opaque. This is what lets one primitive serve connectionless sinks (gchat,
// slack) and connection-oriented ones (a WebSocket) alike. Batches are sent one
// at a time (never concurrently), which gives ordering and suits a single
// connection.

export interface DispatcherOptions<T> {
  // Maximum number of items handed to a single `send` call. The dispatcher
  // buffers pushed items and sends up to `maxBatch` at once. Default `1` — no
  // batching, one `send` per item (still invoked with a one-element array, so
  // `send` always takes an array).
  maxBatch?: number

  // Maximum time to wait, from the first buffered item, for a batch to fill
  // before sending a partial one. Only meaningful with `maxBatch > 1`. Without
  // it, batches form only from items already queued (no waiting) — so a partial
  // batch is never stalled waiting for more.
  maxWait?: Duration

  // Minimum spacing between the start of consecutive `send` calls, to
  // rate-limit a chatty source. Default: none.
  minInterval?: Duration

  // Number of retries after a failed `send` (total attempts = `retries + 1`).
  // Default `0`.
  retries?: number

  // Delay between retry attempts: a fixed `Duration`, or a function of the
  // 1-based attempt number for custom/exponential backoff. Default `0`.
  backoff?: Duration | ((attempt: number) => Duration)

  // Whether a failed `send` should be retried, given the thrown error. Keeps
  // transport-specific policy (e.g. retry timeouts/5xx but not 4xx) in the
  // caller, out of the dispatcher. Default: retry every error (up to `retries`).
  shouldRetry?: (error: unknown) => boolean

  // Upper bound on buffered (not-yet-sent) items. When exceeded, the oldest
  // buffered items are dropped to make room — `push` never blocks, so this is
  // the backpressure valve that stops a slow or unreachable sink from leaking
  // memory under a storm. Default `1000`.
  maxQueue?: number

  // Called with items discarded because `maxQueue` was exceeded.
  onDrop?: (items: T[]) => void

  // Called when a batch is given up on (retries exhausted, or `shouldRetry`
  // returned false). The dispatcher otherwise swallows the error — fire-and-
  // forget must never throw back into the caller.
  onError?: (error: unknown, items: T[]) => void
}

export interface Dispatcher<T> {
  // Enqueue an item. Fire-and-forget: never blocks, never throws.
  push(item: T): void

  // Resolve once the queue has drained (every buffered item sent, dropped, or
  // given up on) and no send is in flight.
  flush(): Promise<void>

  // Flush, then stop accepting new items (subsequent `push` is ignored). For
  // graceful shutdown. The transport itself (e.g. a socket) is closed by
  // whoever owns it — the sink — not the dispatcher.
  close(): Promise<void>
}

// Create a Dispatcher around a `send` callback. See DispatcherOptions for the
// batching / rate-limit / retry / flush semantics.
export function createDispatcher<T>(
  send: (items: T[]) => Promise<void>,
  options: DispatcherOptions<T> = {},
): Dispatcher<T> {
  const {
    maxBatch = 1,
    maxWait,
    minInterval,
    retries = 0,
    backoff = 0,
    shouldRetry = () => true,
    maxQueue = 1000,
    onDrop,
    onError,
  } = options

  const maxWaitMs = maxWait === undefined ? undefined : toMs(maxWait)
  const minIntervalMs = minInterval === undefined ? 0 : toMs(minInterval)
  const backoffMs =
    typeof backoff === 'function'
      ? (attempt: number) => toMs(backoff(attempt))
      : () => toMs(backoff)

  const queue: T[] = []
  let closed = false
  let sending = false
  let pumping = false
  let lastSendStart = 0
  let flushRequested = false

  // The pump parks on this single notifier while idle or debouncing; push() and
  // flush() fire it. Only the pump ever registers a waiter, so one slot is
  // enough and there is no lost-wakeup (push is synchronous and the waiter is
  // installed synchronously before the await).
  let notify: (() => void) | null = null
  const idleWaiters: (() => void)[] = []

  const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

  function waitSignal(ms?: number): Promise<void> {
    return new Promise<void>((resolve) => {
      let timer: ReturnType<typeof setTimeout> | undefined
      notify = () => {
        if (timer !== undefined) clearTimeout(timer)
        notify = null
        resolve()
      }
      if (ms !== undefined) {
        timer = setTimeout(() => {
          notify = null
          resolve()
        }, ms)
      }
    })
  }

  function wake(): void {
    notify?.()
  }

  function settleIdle(): void {
    flushRequested = false
    if (idleWaiters.length > 0) for (const w of idleWaiters.splice(0)) w()
  }

  function push(item: T): void {
    if (closed) return
    queue.push(item)
    if (queue.length > maxQueue) {
      const dropped = queue.splice(0, queue.length - maxQueue)
      try {
        onDrop?.(dropped)
      } catch {
        // a misbehaving onDrop must not break push()
      }
    }
    wake()
    void pump()
  }

  async function pump(): Promise<void> {
    if (pumping) return
    pumping = true
    try {
      for (;;) {
        while (queue.length === 0) {
          if (closed) return
          settleIdle()
          await waitSignal()
        }
        // Debounce: optionally wait for a fuller batch.
        if (maxBatch > 1 && maxWaitMs !== undefined && !flushRequested) {
          const deadline = Date.now() + maxWaitMs
          while (queue.length < maxBatch && !closed && !flushRequested) {
            const remaining = deadline - Date.now()
            if (remaining <= 0) break
            await waitSignal(remaining)
          }
        }
        // Rate limit.
        if (minIntervalMs > 0) {
          const wait = minIntervalMs - (Date.now() - lastSendStart)
          if (wait > 0) await delay(wait)
        }
        const batch = queue.splice(0, maxBatch)
        lastSendStart = Date.now()
        sending = true
        await attemptSend(batch)
        sending = false
        if (queue.length === 0) settleIdle()
      }
    } finally {
      pumping = false
    }
  }

  async function attemptSend(batch: T[]): Promise<void> {
    let lastError: unknown
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await send(batch)
        return
      } catch (error) {
        lastError = error
        if (!shouldRetry(error)) break
        if (attempt < retries) {
          const ms = backoffMs(attempt + 1)
          if (ms > 0) await delay(ms)
        }
      }
    }
    // Every attempt failed (or shouldRetry refused). Fire-and-forget: report and
    // move on — never throw back into the pump.
    try {
      onError?.(lastError, batch)
    } catch {
      // a misbehaving onError must not break the pump
    }
  }

  function flush(): Promise<void> {
    if (queue.length === 0 && !sending) return Promise.resolve()
    flushRequested = true
    wake()
    return new Promise<void>((resolve) => idleWaiters.push(resolve))
  }

  async function close(): Promise<void> {
    if (!closed) {
      closed = true
      wake()
    }
    await flush()
  }

  return { push, flush, close }
}
