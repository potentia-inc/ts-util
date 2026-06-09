import { type Duration } from './duration.js';
export interface DispatcherOptions<T> {
    maxBatch?: number;
    maxWait?: Duration;
    minInterval?: Duration;
    retries?: number;
    backoff?: Duration | ((attempt: number) => Duration);
    shouldRetry?: (error: unknown) => boolean;
    maxQueue?: number;
    onDrop?: (items: T[]) => void;
    onError?: (error: unknown, items: T[]) => void;
}
export interface Dispatcher<T> {
    push(item: T): void;
    flush(): Promise<void>;
    close(): Promise<void>;
}
export declare function createDispatcher<T>(send: (items: T[]) => Promise<void>, options?: DispatcherOptions<T>): Dispatcher<T>;
