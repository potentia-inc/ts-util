import { toMs, type Duration } from './duration.js'

// An AbortController that also aborts after `timeout` (a Duration; a number is
// milliseconds), optionally chained to an upstream `signal`. Built on the
// platform's AbortSignal.timeout (whose timer is unref'd, so it never keeps the
// event loop alive) and AbortSignal.any, rather than a hand-rolled setTimeout
// that would leak a live timer until it fired.
export class TimeoutAbortController extends AbortController {
  constructor(options: { signal?: AbortSignal; timeout: Duration }) {
    super()

    const signals: AbortSignal[] = [AbortSignal.timeout(toMs(options.timeout))]
    if (options.signal) signals.push(options.signal)
    const source = AbortSignal.any(signals)

    if (source.aborted) {
      this.abort(source.reason)
    } else {
      source.addEventListener('abort', () => this.abort(source.reason), {
        once: true,
      })
    }
  }
}
