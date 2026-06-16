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
  // numbers/booleans go straight through BigInt: a non-integer number throws a
  // RangeError, matching BigInt's own contract.
  if (typeof x === 'number' || typeof x === 'boolean') return BigInt(x)
  // strings throw a SyntaxError on malformed input.
  if (typeof x === 'string') return stringToBigInt(x)
  // numeric wrapper objects (e.g. BigNumber, Decimal128, boxed Number) convert
  // via their string form. Arrays are excluded on purpose:
  // String([5]) === '5' would otherwise become 5n, and String([]) === '' -> 0n.
  if (typeof x === 'object' && x !== null && !Array.isArray(x)) {
    try {
      return stringToBigInt(String(x))
    } catch {
      // unparseable object: fall through to the TypeError below
    }
  }
  throw new TypeError(`cannot convert ${typeName(x)} to a bigint`)
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
  if (typeof x === 'bigint' || typeof x === 'boolean') return Number(x)
  if (typeof x === 'string') return stringToNumber(x)
  // numeric wrapper objects (e.g. BigNumber, Decimal128, boxed Number). Arrays
  // are excluded on purpose: Number([5]) === 5 and Number([]) === 0 surprise.
  if (typeof x === 'object' && !Array.isArray(x)) {
    try {
      return stringToNumber(String(x))
    } catch {
      // unparseable object: fall through to the TypeError below
    }
  }
  throw new TypeError(`cannot convert ${typeName(x)} to a number`)
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

// Parse a string as a bigint. Accepts everything BigInt accepts (decimal, hex,
// octal, binary, with an optional sign) plus any decimal/exponent form whose
// value is integral (e.g. '12345.00', '1E3', '1.2300E2'). A non-zero fraction
// throws. Empty/whitespace-only input throws rather than becoming 0n.
function stringToBigInt(s: string): bigint {
  const t = s.trim()
  if (t === '') throw new SyntaxError('cannot convert empty string to a bigint')
  try {
    return BigInt(t)
  } catch {
    return decimalToBigInt(t)
  }
}

function decimalToBigInt(s: string): bigint {
  const m = /^([+-]?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(s)
  if (m === null) throw new SyntaxError(`cannot convert to a bigint: ${s}`)
  const sign = m[1] === '-' ? '-' : ''
  const digits = m[2] + (m[3] ?? '') // integer + fraction digits, no point
  // value = digits * 10**scale
  const scale =
    (m[4] !== undefined ? parseInt(m[4], 10) : 0) - (m[3]?.length ?? 0)
  if (scale >= 0) return BigInt(sign + digits + '0'.repeat(scale))
  // scale < 0: the last |scale| digits are fractional and must all be zero.
  const keep = digits.length + scale
  const dropped = keep >= 0 ? digits.slice(keep) : digits
  if (/[^0]/.test(dropped)) {
    throw new SyntaxError(`cannot convert a fractional value to a bigint: ${s}`)
  }
  return BigInt(sign + (keep > 0 ? digits.slice(0, keep) : '0'))
}

// Parse a string as a number. Empty/whitespace-only input throws rather than
// becoming 0.
function stringToNumber(s: string): number {
  const t = s.trim()
  const n = t === '' ? NaN : Number(t)
  if (isNaN(n)) throw new TypeError(`cannot convert to a number: ${s}`)
  return n
}

function typeName(x: unknown): string {
  if (x === null) return 'null'
  if (Array.isArray(x)) return 'array'
  return typeof x
}
