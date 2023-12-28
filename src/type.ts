declare global {
  interface BigInt {
    toJSON: () => string
  }
}

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString()
}

export function toBigInt(x?: unknown): bigint {
  if (typeof x === 'bigint') return x
  if (typeof x === 'number' || typeof x === 'string') return BigInt(x)
  return BigInt(String(x))
}

export function toBigIntOrNil(x?: unknown): bigint | undefined {
  return isNil(x) ? undefined : toBigInt(x)
}

export function toDate(x?: unknown): Date {
  if (x instanceof Date) return x
  if (isNil(x)) return new Date()
  if (typeof x === 'number' || typeof x === 'string') return new Date(x)
  return new Date(String(x))
}

export function toDateOrNil(x?: unknown): Date | undefined {
  return isNil(x) ? undefined : toDate(x)
}

function isNil(x: unknown): boolean {
  return x === undefined || x === null
}
