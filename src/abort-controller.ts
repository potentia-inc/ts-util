import { Nil, isNullish } from './type.js'

export class TimeoutAbortController extends AbortController {
  #timeout: ReturnType<typeof setTimeout> | Nil = Nil
  #signal?: AbortSignal
  #onAbort: (() => void) | Nil = Nil

  constructor(options: { signal?: AbortSignal; timeout: number }) {
    super()

    const { signal, timeout } = options

    if (!isNullish(signal)) {
      this.#signal = signal
      if (signal.aborted) {
        // already aborted
        this.abort(signal.reason)
        return
      } else {
        this.#onAbort = () => this.abort(signal.reason)
        signal.addEventListener('abort', this.#onAbort)
      }
    }

    this.#timeout = setTimeout(() => {
      this.abort(new Error('TimeoutAbortController: timeout'))
    }, timeout * 1000)

    this.signal.addEventListener('abort', () => this.#cleanup())
  }

  #cleanup() {
    if (!isNullish(this.#signal) && !isNullish(this.#onAbort)) {
      this.#signal.removeEventListener('abort', this.#onAbort)
      this.#signal = this.#onAbort = Nil
    }

    if (!isNullish(this.#timeout)) {
      clearTimeout(this.#timeout)
      this.#timeout = Nil
    }
  }
}
