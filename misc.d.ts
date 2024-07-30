export { setTimeout as sleep } from 'node:timers/promises';
export declare function option<T>(key: string, value: T | undefined): Record<string, NonNullable<T>> | undefined;
