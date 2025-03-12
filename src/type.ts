declare global {
  interface BigInt {
    toJSON: () => string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const NIL = undefined // for backward compatibility
export const Nil = undefined
export type Nil = typeof undefined
export type NumStr = `${number}`
export type TypeOrNil<T> = T | Nil

export type PickRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type MixRequiredPartial<
  T,
  R extends keyof T,
  O extends keyof T,
> = Required<Pick<T, R>> & Partial<Pick<T, O>> & Omit<T, R | O>

export type BigIntOrNil = TypeOrNil<bigint>
export type DateOrNil = TypeOrNil<Date>
export type NumberOrNil = TypeOrNil<number>
export type StringOrNil = TypeOrNil<string>
export type BufferOrNil = TypeOrNil<Buffer>
export type NumStrOrNil = TypeOrNil<NumStr>

export function toBigInt(x?: unknown): bigint {
  if (typeof x === 'bigint') return x
  if (typeof x === 'number' || typeof x === 'string') return BigInt(x)
  return BigInt(String(x))
}

export function toBigIntOrNil(x?: unknown): BigIntOrNil {
  return isNullish(x) ? Nil : toBigInt(x)
}

export function toDate(x?: unknown): Date {
  if (x instanceof Date) return x
  if (isNullish(x)) return new Date()
  if (typeof x === 'number' || typeof x === 'string') return new Date(x)
  return new Date(String(x))
}

export function toDateOrNil(x?: unknown): DateOrNil {
  return isNullish(x) ? Nil : toDate(x)
}

export function toNumber(x?: unknown): number {
  return typeof x === 'number' ? x : Number(x)
}

export function toNumberOrNil(x?: unknown): NumberOrNil {
  return isNullish(x) ? Nil : toNumber(x)
}

export function toString(x?: unknown): string {
  return typeof x === 'string' ? x : String(x)
}

export function toStringOrNil(x?: unknown): StringOrNil {
  return isNullish(x) ? Nil : toString(x)
}

export function isNullish<T>(x: T): x is Extract<T, null | undefined> {
  return x === null || x === undefined
}
