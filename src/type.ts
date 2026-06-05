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
export type Uint8ArrayOrNil = TypeOrNil<Uint8Array>
export type NumStrOrNil = TypeOrNil<NumStr>

// Strict coercions: throw on nullish and on unparseable input.
// The `...OrNil` variants return Nil for nullish but still throw on invalid.

export function toBigInt(x?: unknown): bigint {
  if (typeof x === 'bigint') return x
  if (
    typeof x === 'number' ||
    typeof x === 'string' ||
    typeof x === 'boolean'
  ) {
    return BigInt(x)
  }
  throw new TypeError(`cannot convert ${typeof x} to a bigint`)
}

export function toBigIntOrNil(x?: unknown): BigIntOrNil {
  return isNullish(x) ? Nil : toBigInt(x)
}

export function toDate(x?: unknown): Date {
  if (isNullish(x)) {
    throw new TypeError('cannot convert null or undefined to a Date')
  }
  const date =
    x instanceof Date
      ? x
      : new Date(typeof x === 'number' || typeof x === 'string' ? x : String(x))
  if (isNaN(date.getTime())) {
    throw new TypeError(`cannot convert to a valid Date: ${String(x)}`)
  }
  return date
}

export function toDateOrNil(x?: unknown): DateOrNil {
  return isNullish(x) ? Nil : toDate(x)
}

export function toNumber(x?: unknown): number {
  if (isNullish(x)) {
    throw new TypeError('cannot convert null or undefined to a number')
  }
  if (typeof x === 'number') return x
  const n = Number(x)
  if (isNaN(n)) throw new TypeError(`cannot convert to a number: ${String(x)}`)
  return n
}

export function toNumberOrNil(x?: unknown): NumberOrNil {
  return isNullish(x) ? Nil : toNumber(x)
}

export function toString(x?: unknown): string {
  if (isNullish(x)) {
    throw new TypeError('cannot convert null or undefined to a string')
  }
  return typeof x === 'string' ? x : String(x)
}

export function toStringOrNil(x?: unknown): StringOrNil {
  return isNullish(x) ? Nil : toString(x)
}

export function isNullish<T>(x: T): x is Extract<T, null | undefined> {
  return x === null || x === undefined
}
