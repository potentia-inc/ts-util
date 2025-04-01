import { Nil, TypeOrNil } from './type.js';
export { setTimeout as sleep } from 'node:timers/promises';
export declare function ssleep(s: number): Promise<boolean>;
export declare function msleep(ms: number): Promise<boolean>;
export declare function option<T>(key: string, value: T | Nil | null): TypeOrNil<Record<string, NonNullable<T>>>;
