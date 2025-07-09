export class PromiseTracker {
    #promise;
    #settled = false;
    get promise() {
        return this.#promise;
    }
    get isSettled() {
        return this.#settled;
    }
    constructor(promise) {
        this.#promise = promise;
        promise.finally(() => {
            this.#settled = true;
        });
    }
}
//# sourceMappingURL=promise.js.map