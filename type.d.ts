declare global {
    interface BigInt {
        toJSON: () => string;
    }
}
export declare const NIL: undefined;
export type Nil = typeof NIL;
export type TypeOrNil<T> = T | Nil;
export type BigIntOrNil = TypeOrNil<bigint>;
export type DateOrNil = TypeOrNil<Date>;
export type NumberOrNil = TypeOrNil<number>;
export type StringOrNil = TypeOrNil<string>;
export declare function toBigInt(x?: unknown): bigint;
export declare function toBigIntOrNil(x?: unknown): BigIntOrNil;
export declare function toDate(x?: unknown): Date;
export declare function toDateOrNil(x?: unknown): DateOrNil;
