/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { toBigInt, toDate } from './index.js'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'

interface CustomMatchers<R = unknown> {
  toBeBigInt: (this: unknown) => R
  toEqualBigInt: (this: unknown, expected: unknown) => R
  // toBeDate() and toBeValidDate(): see jest-extended
  toEqualDate: (this: unknown, expected: unknown) => R
  toBeTimestamp: (this: unknown) => R
  toEqualTimestamp: (this: unknown, expected: unknown) => R
  toBeValidTimestamp: (this: unknown) => R
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

type This = {
  isNot: boolean
  promise: string
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
    matcherHint('toBeBigInt', undefined, undefined, options),
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
    matcherHint('toEqualBigInt', undefined, undefined, options),
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
    matcherHint('toEqualDate', undefined, undefined, options),
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
    matcherHint('toBeTimestamp', undefined, undefined, options),
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
    matcherHint('toEqualTimestamp', undefined, undefined, options),
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
    matcherHint('toBeValidTimestamp', undefined, undefined, options),
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
