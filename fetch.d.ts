import { type Duration } from './duration.js';
export declare function fetch(url: string, options?: RequestInit & {
    timeout?: Duration;
}): Promise<Response>;
