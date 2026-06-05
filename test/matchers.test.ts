import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import * as matchers from '../src/matcher/core.js'
import type { MatcherContext } from '../src/matcher/core.js'

// A minimal jest-compatible `this.utils` so the framework-agnostic matcher
// logic can be exercised on any runtime without a test framework installed.
const ctx: MatcherContext = {
  isNot: false,
  promise: '',
  utils: {
    matcherHint: () => '',
    printReceived: (v) => String(v),
    printExpected: (v) => String(v),
  },
}

describe('matchers (framework-agnostic core)', () => {
  test('toBeNil', () => {
    assert.equal(matchers.toBeNil.call(ctx, undefined).pass, true)
    assert.equal(matchers.toBeNil.call(ctx, null).pass, false)
    assert.equal(matchers.toBeNil.call(ctx, 0).pass, false)
  })

  test('toBeBigInt: type with no arg, equality with an arg', () => {
    // no argument -> type check
    assert.equal(matchers.toBeBigInt.call(ctx, 1n).pass, true)
    assert.equal(matchers.toBeBigInt.call(ctx, 1).pass, false)
    // argument -> equality (toEqualBigInt is the same function)
    assert.equal(matchers.toBeBigInt.call(ctx, 1n, 1).pass, true)
    assert.equal(matchers.toEqualBigInt.call(ctx, 1n, '1').pass, true)
    assert.equal(matchers.toEqualBigInt.call(ctx, 1n, 2).pass, false)
    // an explicit undefined arg is an equality check that fails, not a type check
    assert.equal(matchers.toBeBigInt.call(ctx, 1n, undefined).pass, false)
  })

  test('toBeDate / toEqualDate', () => {
    const d = new Date()
    assert.equal(matchers.toBeDate.call(ctx, d).pass, true) // type
    assert.equal(matchers.toBeDate.call(ctx, 0).pass, false)
    assert.equal(matchers.toEqualDate.call(ctx, d, d.getTime()).pass, true)
    assert.equal(matchers.toEqualDate.call(ctx, d, new Date(0)).pass, false)
    assert.equal(matchers.toBeDate.call(ctx, d, undefined).pass, false)
  })

  test('timestamps', () => {
    const t = Date.now()
    assert.equal(matchers.toBeTimestamp.call(ctx, t).pass, true)
    assert.equal(matchers.toBeTimestamp.call(ctx, '1').pass, false)
    assert.equal(matchers.toBeTimestamp.call(ctx, t, t).pass, true)
    assert.equal(matchers.toEqualTimestamp.call(ctx, t, t).pass, true)
    assert.equal(matchers.toBeValidTimestamp.call(ctx, t).pass, true)
    assert.equal(matchers.toBeValidTimestamp.call(ctx, NaN).pass, false)
  })

  test('toBeDateString (date or date-time string)', () => {
    assert.equal(matchers.toBeDateString.call(ctx, '2020-01-01').pass, true)
    assert.equal(
      matchers.toBeDateString.call(ctx, '2020-01-01T12:30:00Z').pass,
      true,
    )
    assert.equal(matchers.toBeDateString.call(ctx, 'garbage').pass, false)
    assert.equal(matchers.toBeDateString.call(ctx, 123).pass, false)
  })

  test('throws when given more than one argument', () => {
    assert.throws(() => matchers.toBeBigInt.call(ctx, 1n, 1, 2), /at most one/)
  })

  test('message() renders a string', () => {
    assert.equal(typeof matchers.toBeNil.call(ctx, 5).message(), 'string')
    assert.equal(typeof matchers.toBeBigInt.call(ctx, 5, 6).message(), 'string')
  })
})
