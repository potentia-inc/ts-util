declare global {
    interface BigInt {
        toJSON: () => string;
    }
}
export declare const NIL: undefined;
export declare const Nil: undefined;
export type Nil = typeof undefined;
export type NumStr = `${number}`;
export type TypeOrNil<T> = T | Nil;
export type PickRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type MixRequiredPartial<T, R extends keyof T, O extends keyof T> = Required<Pick<T, R>> & Partial<Pick<T, O>> & Omit<T, R | O>;
export type BigIntOrNil = TypeOrNil<bigint>;
export type DateOrNil = TypeOrNil<Date>;
export type NumberOrNil = TypeOrNil<number>;
export type StringOrNil = TypeOrNil<string>;
export type BufferOrNil = TypeOrNil<Buffer>;
export type NumStrOrNil = TypeOrNil<NumStr>;
export declare function toBigInt(x?: unknown): bigint;
export declare function toBigIntOrNil(x?: unknown): BigIntOrNil;
export declare function toDate(x?: unknown): Date;
export declare function toDateOrNil(x?: unknown): DateOrNil;
export declare function toNumber(x?: unknown): number;
export declare function toNumberOrNil(x?: unknown): NumberOrNil;
export declare function toString(x?: unknown): string;
export declare function toStringOrNil(x?: unknown): StringOrNil;
export declare function isNullish<T>(x: T): x is Extract<T, null | undefined>;
