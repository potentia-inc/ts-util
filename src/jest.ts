// /* eslint-disable @typescript-eslint/restrict-template-expressions */

import { Nil, toBigInt, toDate } from './index.js'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'

interface CustomMatchers<R = unknown> {
  toBeNil: (this: unknown) => R
  toBeBigInt: (this: unknown) => R
  toEqualBigInt: (this: unknown, expected: unknown) => R
  // toBeDate() and toBeValidDate(): see jest-extended
  toEqualDate: (this: unknown, expected: unknown) => R
  toBeTimestamp: (this: unknown) => R
  toEqualTimestamp: (this: unknown, expected: unknown) => R
  toBeValidTimestamp: (this: unknown) => R
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */
  }
}

type This = {
  isNot: boolean
  promise: string
}

export function toBeNil(
  this: unknown,
  received: unknown,
): jest.CustomMatcherResult {
  const { isNot, promise } = this as unknown as This
  const comment = 'Nil type validity'
  const options = { comment, isNot, promise }
  const pass = received === Nil
  const message = getMessage(
    pass,
    matcherHint('toBeNil', Nil, Nil, options),
    printReceived(received),
    printExpected('Nil'),
  )
  return { message, pass }
}

export function toBeBigInt(
  this: unknown,
  received: unknown,
): jest.CustomMatcherResult {
  const { isNot, promise } = this as unknown as This
  const comment = 'BigInt type validity'
  const options = { comment, isNot, promise }
  const pass = typeof received === 'bigint'
  const message = getMessage(
    pass,
    matcherHint('toBeBigInt', Nil, Nil, options),
    printReceived(received),
    printExpected('BigInt'),
  )
  return { message, pass }
}

export function toEqualBigInt(
  this: unknown,
  received: unknown,
  expected: unknown,
): jest.CustomMatcherResult {
  const { isNot, promise } = this as unknown as This
  const comment = 'BigInt equality'
  const options = { comment, isNot, promise }
  const pass = typeof received === 'bigint' && received === toBigInt(expected)
  const message = getMessage(
    pass,
    matcherHint('toEqualBigInt', Nil, Nil, options),
    printReceived(received),
    printExpected(toBigInt(expected)),
  )
  return { message, pass }
}

export function toEqualDate(
  this: unknown,
  received: unknown,
  expected: unknown,
): jest.CustomMatcherResult {
  const { isNot, promise } = this as unknown as This
  const comment = 'Date type and optional value equality'
  const options = { comment, isNot, promise }
  const pass =
    received instanceof Date &&
    received.getTime() === toDate(expected).getTime()
  const message = getMessage(
    pass,
    matcherHint('toEqualDate', Nil, Nil, options),
    printReceived(received),
    printExpected(toDate(expected)),
  )
  return { message, pass }
}

export function toBeTimestamp(
  this: unknown,
  received: unknown,
): jest.CustomMatcherResult {
  const { isNot, promise } = this as This
  const options = { comment: 'Timestamp type validity', isNot, promise }
  const pass = typeof received === 'number'
  const message = getMessage(
    pass,
    matcherHint('toBeTimestamp', Nil, Nil, options),
    printReceived(received),
    printExpected('Timestamp'),
  )
  return { message, pass }
}

export function toEqualTimestamp(
  this: unknown,
  received: unknown,
  expected: unknown,
): jest.CustomMatcherResult {
  const { isNot, promise } = this as This
  const options = { comment: 'Timestamp equality', isNot, promise }
  const pass =
    typeof received === 'number' &&
    toDate(received).getTime() === toDate(expected).getTime()
  const message = getMessage(
    pass,
    matcherHint('toEqualTimestamp', Nil, Nil, options),
    printReceived(received),
    printExpected(toDate(expected).getTime()),
  )
  return { message, pass }
}

export function toBeValidTimestamp(
  this: unknown,
  received: unknown,
): jest.CustomMatcherResult {
  const { isNot, promise } = this as This
  const options = { comment: 'Timestamp validity', isNot, promise }
  const pass =
    typeof received === 'number' && !isNaN(new Date(received).getTime())
  const message = getMessage(
    pass,
    matcherHint('toBeValidTimestamp', Nil, Nil, options),
    printReceived(received),
    printExpected('valid timestamp'),
  )
  return { message, pass }
}

function getMessage(
  pass: boolean,
  hint: string,
  received: string,
  expected: string,
): () => string {
  const not = pass ? 'not ' : ''
  return () => `${hint}\n\nExpected: ${not}${expected}\nReceived: ${received}`
}
