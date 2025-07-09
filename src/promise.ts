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
    promise.finally(() => {
      this.#settled = true
    })
  }
}
