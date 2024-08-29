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
export type TypeOrNil<T> = T | Nil

export type BigIntOrNil = TypeOrNil<bigint>
export type DateOrNil = TypeOrNil<Date>
export type NumberOrNil = TypeOrNil<number>
export type StringOrNil = TypeOrNil<string>

export function toBigInt(x?: unknown): bigint {
  if (typeof x === 'bigint') return x
  if (typeof x === 'number' || typeof x === 'string') return BigInt(x)
  return BigInt(String(x))
}

export function toBigIntOrNil(x?: unknown): BigIntOrNil {
  return x === Nil || x === null ? Nil : toBigInt(x)
}

export function toDate(x?: unknown): Date {
  if (x instanceof Date) return x
  if (x === Nil || x === null) return new Date()
  if (typeof x === 'number' || typeof x === 'string') return new Date(x)
  return new Date(String(x))
}

export function toDateOrNil(x?: unknown): DateOrNil {
  return x === Nil || x === null ? Nil : toDate(x)
}
