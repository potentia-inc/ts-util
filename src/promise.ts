export class PromiseTracker<T> {
  #promise: Promise<T>
  #settled: boolean = false

  get promise() {
    return this.#promise
  }

  get isSettled() {
    return this.#settled
  }

  constructor(promise: Promise<T>) {
    this.#promise = promise
    // Use then() with both handlers (not finally()): finally() returns a
    // derived promise that re-raises the rejection, producing a spurious
    // unhandledRejection on a branch the caller cannot observe.
    void promise.then(
      () => {
        this.#settled = true
      },
      () => {
        this.#settled = true
      },
    )
  }
}
