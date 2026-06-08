export type Duration = number | `${number}s` | `${number}ms`;
export declare function toMs(duration: Duration): number;
