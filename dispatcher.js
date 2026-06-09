import { toMs } from './duration.js';
// Create a Dispatcher around a `send` callback. See DispatcherOptions for the
// batching / rate-limit / retry / flush semantics.
export function createDispatcher(send, options = {}) {
    const { maxBatch = 1, maxWait, minInterval, retries = 0, backoff = 0, shouldRetry = () => true, maxQueue = 1000, onDrop, onError, } = options;
    const maxWaitMs = maxWait === undefined ? undefined : toMs(maxWait);
    const minIntervalMs = minInterval === undefined ? 0 : toMs(minInterval);
    const backoffMs = typeof backoff === 'function'
        ? (attempt) => toMs(backoff(attempt))
        : () => toMs(backoff);
    const queue = [];
    let closed = false;
    let sending = false;
    let pumping = false;
    let lastSendStart = 0;
    let flushRequested = false;
    // The pump parks on this single notifier while idle or debouncing; push() and
    // flush() fire it. Only the pump ever registers a waiter, so one slot is
    // enough and there is no lost-wakeup (push is synchronous and the waiter is
    // installed synchronously before the await).
    let notify = null;
    const idleWaiters = [];
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    function waitSignal(ms) {
        return new Promise((resolve) => {
            let timer;
            notify = () => {
                if (timer !== undefined)
                    clearTimeout(timer);
                notify = null;
                resolve();
            };
            if (ms !== undefined) {
                timer = setTimeout(() => {
                    notify = null;
                    resolve();
                }, ms);
            }
        });
    }
    function wake() {
        notify?.();
    }
    function settleIdle() {
        flushRequested = false;
        if (idleWaiters.length > 0)
            for (const w of idleWaiters.splice(0))
                w();
    }
    function push(item) {
        if (closed)
            return;
        queue.push(item);
        if (queue.length > maxQueue) {
            const dropped = queue.splice(0, queue.length - maxQueue);
            try {
                onDrop?.(dropped);
            }
            catch {
                // a misbehaving onDrop must not break push()
            }
        }
        wake();
        void pump();
    }
    async function pump() {
        if (pumping)
            return;
        pumping = true;
        try {
            for (;;) {
                while (queue.length === 0) {
                    if (closed)
                        return;
                    settleIdle();
                    await waitSignal();
                }
                // Debounce: optionally wait for a fuller batch.
                if (maxBatch > 1 && maxWaitMs !== undefined && !flushRequested) {
                    const deadline = Date.now() + maxWaitMs;
                    while (queue.length < maxBatch && !closed && !flushRequested) {
                        const remaining = deadline - Date.now();
                        if (remaining <= 0)
                            break;
                        await waitSignal(remaining);
                    }
                }
                // Rate limit.
                if (minIntervalMs > 0) {
                    const wait = minIntervalMs - (Date.now() - lastSendStart);
                    if (wait > 0)
                        await delay(wait);
                }
                const batch = queue.splice(0, maxBatch);
                lastSendStart = Date.now();
                sending = true;
                await attemptSend(batch);
                sending = false;
                if (queue.length === 0)
                    settleIdle();
            }
        }
        finally {
            pumping = false;
        }
    }
    async function attemptSend(batch) {
        let lastError;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                await send(batch);
                return;
            }
            catch (error) {
                lastError = error;
                if (!shouldRetry(error))
                    break;
                if (attempt < retries) {
                    const ms = backoffMs(attempt + 1);
                    if (ms > 0)
                        await delay(ms);
                }
            }
        }
        // Every attempt failed (or shouldRetry refused). Fire-and-forget: report and
        // move on — never throw back into the pump.
        try {
            onError?.(lastError, batch);
        }
        catch {
            // a misbehaving onError must not break the pump
        }
    }
    function flush() {
        if (queue.length === 0 && !sending)
            return Promise.resolve();
        flushRequested = true;
        wake();
        return new Promise((resolve) => idleWaiters.push(resolve));
    }
    async function close() {
        if (!closed) {
            closed = true;
            wake();
        }
        await flush();
    }
    return { push, flush, close };
}
