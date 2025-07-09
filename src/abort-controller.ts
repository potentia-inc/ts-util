export class TimeoutAbortController extends AbortController {
  constructor(options: { signal?: AbortSignal; timeout: number }) {
    super()

    const { signal } = options
    if (signal?.aborted) {
      this.abort(signal.reason) // already aborted
    } else {
      const onAbort = () => this.abort(signal?.reason)
      signal?.addEventListener('abort', onAbort)
      const timeout = setTimeout(() => {
        this.abort(new Error('TimeoutAbortController: timeout'))
      }, options.timeout * 1000)

      const cleanup = () => {
        signal?.removeEventListener('abort', onAbort)
        clearTimeout(timeout)
        this.signal.removeEventListener('abort', cleanup)
      }
      this.signal.addEventListener('abort', cleanup)
    }
  }
}
