import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import {
  Nil,
  toBigInt,
  toBigIntOrNil,
  toDate,
  toDateOrNil,
  toNumber,
  toNumberOrNil,
  toString,
  toStringOrNil,
  type PickRequired,
  type PickPartial,
  type MixRequiredPartial,
  type TypeOrNil,
} from '../src/type.js'

describe('Nil', () => {
  test('Nil', () => {
    assert.equal(Nil, undefined)
    assert.equal(undefined, Nil)
  })

  test('TypeOrNil<>', () => {
    class Foo {}
    type FooOrNil = TypeOrNil<Foo>
    const foo: FooOrNil = Nil
    assert.equal(foo, Nil)
  })
})

describe('type utility', () => {
  test('PickPartial', () => {
    type Foo = {
      a: string
      b: number
    }
    const foo: PickPartial<Foo, 'b'> = { a: 'bar' }
    assert.equal(foo.a, 'bar')
    assert.equal(foo.b, Nil)
  })

  test('PickRequired', () => {
    type Foo = {
      a?: string
      b?: number
    }
    const foo: PickRequired<Foo, 'a'> = { a: 'bar' }
    assert.equal(foo.a, 'bar')
    assert.equal(foo.b, Nil)
  })

  test('MixRequiredPartial', () => {
    type Foo = {
      a?: string
      b: number
      c: boolean
    }
    const foo: MixRequiredPartial<Foo, 'a', 'b'> = { a: 'bar', c: true }
    assert.equal(foo.a, 'bar')
    assert.equal(foo.b, Nil)
    assert.equal(foo.c, true)
  })
})

describe('bigint', () => {
  test('toBigInt()', () => {
    assert.equal(typeof toBigInt(12345), 'bigint')
    assert.equal(toBigInt(12345), 12345n)
    assert.equal(toBigInt('12345'), 12345n)
    assert.equal(toBigInt(true), 1n)
  })

  test('toBigInt() throws on nullish and invalid', () => {
    assert.throws(() => toBigInt(), TypeError) // nullish
    assert.throws(() => toBigInt(null), TypeError)
    assert.throws(() => toBigInt({}), TypeError)
    assert.throws(() => toBigInt('foobar'), SyntaxError)
    assert.throws(() => toBigInt(1.234), RangeError)
  })

  test('toBigIntOrNil()', () => {
    assert.equal(toBigIntOrNil(null), Nil)
    assert.equal(toBigIntOrNil(Nil), Nil)
    assert.equal(typeof toBigIntOrNil(0n), 'bigint')
    assert.throws(() => toBigIntOrNil('foobar'), SyntaxError) // invalid still throws
  })
})

describe('date', () => {
  test('toDate()', () => {
    const now = new Date()
    assert.equal(toDate(now), now)
    assert.equal(toDate(now.getTime()).getTime(), now.getTime())
    assert.equal(toDate(now.toISOString()).getTime(), now.getTime())
    assert.equal(
      toDate({ toString: () => now.toISOString() }).getTime(),
      now.getTime(),
    )
  })

  test('toDate() throws on nullish and invalid', () => {
    assert.throws(() => toDate(), TypeError) // no longer returns "now"
    assert.throws(() => toDate(null), TypeError)
    assert.throws(() => toDate('garbage'), TypeError)
  })

  test('toDateOrNil()', () => {
    assert.equal(toDateOrNil(null), Nil)
    assert.equal(toDateOrNil(Nil), Nil)
    const now = new Date()
    assert.equal(toDateOrNil(now), now)
    assert.throws(() => toDateOrNil('garbage'), TypeError)
  })
})

describe('number', () => {
  test('toNumber()', () => {
    assert.equal(toNumber(123), 123)
    assert.equal(toNumber('123'), 123)
    assert.equal(toNumber(true), 1)
  })

  test('toNumber() throws on nullish and invalid', () => {
    assert.throws(() => toNumber(), TypeError)
    assert.throws(() => toNumber(null), TypeError)
    assert.throws(() => toNumber('abc'), TypeError)
  })

  test('toNumberOrNil()', () => {
    assert.equal(toNumberOrNil(Nil), Nil)
    assert.equal(toNumberOrNil(null), Nil)
    assert.equal(toNumberOrNil(123), 123)
    assert.equal(toNumberOrNil('123'), 123)
    assert.throws(() => toNumberOrNil('abc'), TypeError)
  })
})

describe('string', () => {
  test('toString()', () => {
    assert.equal(toString('abc'), 'abc')
    assert.equal(toString(123), '123')
    assert.equal(toString(true), 'true')
  })

  test('toString() throws on nullish', () => {
    assert.throws(() => toString(), TypeError)
    assert.throws(() => toString(null), TypeError)
  })

  test('toStringOrNil()', () => {
    assert.equal(toStringOrNil(Nil), Nil)
    assert.equal(toStringOrNil(null), Nil)
    assert.equal(toStringOrNil(123), '123')
  })
})
