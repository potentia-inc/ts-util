import { Nil, toBigInt, toDate } from '../type.js'

// Framework-agnostic matcher implementations shared by the jest, bun and vitest
// adapters. They rely only on the jest-compatible `this.utils` that all three
// runners provide, so this module has zero test-framework dependencies.

export interface MatcherUtils {
  matcherHint: (
    name: string,
    received?: string,
    expected?: string,
    options?: { comment?: string; isNot?: boolean; promise?: string },
  ) => string
  printReceived: (value: unknown) => string
  printExpected: (value: unknown) => string
}

export interface MatcherContext {
  // Optional so the richer jest/bun/vitest contexts (where these are optional)
  // remain assignable to this shared shape — keeping expect.extend(matchers)
  // type-safe for consumers without a cast.
  isNot?: boolean
  promise?: string
  utils: MatcherUtils
}

export interface MatcherResult {
  pass: boolean
  message: () => string
}

// Each toBe*/toEqual* matcher checks a type when called with no argument, or
// type-and-value equality when given one. `toBe*` and `toEqual*` are the same
// function under two names; pick whichever reads better.
export interface CustomMatchers<R = unknown> {
  toBeNil(): R
  toBeBigInt(expected?: unknown): R
  toEqualBigInt(expected: unknown): R
  toBeDate(expected?: unknown): R
  toEqualDate(expected: unknown): R
  toBeTimestamp(expected?: unknown): R
  toEqualTimestamp(expected: unknown): R
  toBeValidTimestamp(): R
  toBeDateString(): R
}

type Matcher = (
  this: MatcherContext,
  received: unknown,
  ...rest: unknown[]
) => MatcherResult

// Sentinel for "no expected argument was passed" — distinct from `undefined`,
// which is a real value to compare against (so toBeBigInt() is a type check but
// toBeBigInt(undefined) is an equality check that fails).
const TYPE_ONLY = Symbol('type-only')

// Validate the argument count once (shared by every matcher) and report the
// mode: TYPE_ONLY when no argument was passed, else the expected value.
function expected(name: string, rest: unknown[]): unknown {
  if (rest.length > 1) throw new Error(`${name}: expected at most one argument`)
  return rest.length === 0 ? TYPE_ONLY : rest[0]
}

function build(
  ctx: MatcherContext,
  name: string,
  comment: string,
  pass: boolean,
  received: unknown,
  shown: unknown,
): MatcherResult {
  const { isNot, promise, utils } = ctx
  const hint = utils.matcherHint(name, Nil, Nil, { comment, isNot, promise })
  const not = pass ? 'not ' : ''
  return {
    pass,
    message: () =>
      `${hint}\n\nExpected: ${not}${utils.printExpected(shown)}\n` +
      `Received: ${utils.printReceived(received)}`,
  }
}

// Build a matcher that checks `isType` alone (no argument) or type plus value
// equality (one argument). `convert` turns the expected argument into the value
// compared and displayed; a conversion that throws (e.g. an undefined or
// unparseable expected) counts as "not equal" rather than erroring.
function combined(
  name: string,
  label: string,
  isType: (received: unknown) => boolean,
  convert: (expected: unknown) => unknown,
  equals: (received: unknown, expected: unknown) => boolean,
): Matcher {
  return function (this: MatcherContext, received, ...rest): MatcherResult {
    const arg = expected(name, rest)
    if (arg === TYPE_ONLY) {
      return build(
        this,
        name,
        `${label} type`,
        isType(received),
        received,
        label,
      )
    }
    let pass = false
    let shown: unknown = arg
    try {
      shown = convert(arg)
      pass = isType(received) && equals(received, shown)
    } catch {
      pass = false
    }
    return build(this, name, `${label} equality`, pass, received, shown)
  }
}

export function toBeNil(
  this: MatcherContext,
  received: unknown,
): MatcherResult {
  return build(this, 'toBeNil', 'Nil', received === Nil, received, 'Nil')
}

export const toBeBigInt = combined(
  'toBeBigInt',
  'BigInt',
  (received) => typeof received === 'bigint',
  (expected) => toBigInt(expected),
  (received, expected) => received === expected,
)
export const toEqualBigInt = toBeBigInt

export const toBeDate = combined(
  'toBeDate',
  'Date',
  (received) => received instanceof Date,
  (expected) => toDate(expected),
  (received, expected) =>
    (received as Date).getTime() === (expected as Date).getTime(),
)
export const toEqualDate = toBeDate

export const toBeTimestamp = combined(
  'toBeTimestamp',
  'Timestamp',
  (received) => typeof received === 'number',
  (expected) => toDate(expected).getTime(),
  (received, expected) => toDate(received as number).getTime() === expected,
)
export const toEqualTimestamp = toBeTimestamp

export function toBeValidTimestamp(
  this: MatcherContext,
  received: unknown,
): MatcherResult {
  const pass =
    typeof received === 'number' && !isNaN(new Date(received).getTime())
  return build(
    this,
    'toBeValidTimestamp',
    'Timestamp validity',
    pass,
    received,
    'valid timestamp',
  )
}

export function toBeDateString(
  this: MatcherContext,
  received: unknown,
): MatcherResult {
  const pass =
    typeof received === 'string' && !isNaN(new Date(received).getTime())
  return build(
    this,
    'toBeDateString',
    'Date string validity',
    pass,
    received,
    'date string',
  )
}
