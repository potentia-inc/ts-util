export declare class TimeoutAbortController extends AbortController {
    constructor(options: {
        signal?: AbortSignal;
        timeout: number;
    });
}
