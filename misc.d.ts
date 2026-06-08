import { Nil, type TypeOrNil } from './type.js';
import { type Duration } from './duration.js';
export interface SleepOptions {
    signal?: AbortSignal;
    ref?: boolean;
}
export declare function sleep(duration: Duration, options?: SleepOptions): Promise<void>;
export declare function msleep(ms: number, options?: SleepOptions): Promise<void>;
export declare function ssleep(s: number, options?: SleepOptions): Promise<void>;
export declare function option<T>(key: string, value: T | Nil | null): TypeOrNil<Record<string, NonNullable<T>>>;
