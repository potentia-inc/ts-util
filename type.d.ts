declare global {
    interface BigInt {
        toJSON: () => string;
    }
}
export declare function toBigInt(x?: unknown): bigint;
export declare function toBigIntOrNil(x?: unknown): bigint | undefined;
export declare function toDate(x?: unknown): Date;
export declare function toDateOrNil(x?: unknown): Date | undefined;
