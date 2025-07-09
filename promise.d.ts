export declare class PromiseTracker<T> {
    #private;
    get promise(): Promise<T>;
    get isSettled(): boolean;
    constructor(promise: Promise<T>);
}
