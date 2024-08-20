import { Nil, TypeOrNil } from './type.js';
export { setTimeout as sleep } from 'node:timers/promises';
export declare function option<T>(key: string, value: T | Nil | null): TypeOrNil<Record<string, NonNullable<T>>>;
