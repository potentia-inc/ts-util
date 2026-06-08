import { type Duration } from './duration.js';
export declare class TimeoutAbortController extends AbortController {
    constructor(options: {
        signal?: AbortSignal;
        timeout: Duration;
    });
}
