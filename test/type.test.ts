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

  test('toBigInt() parses hex, exponents and integral decimals', () => {
    assert.equal(toBigInt('0x1f'), 31n) // hex still accepted
    assert.equal(toBigInt('-5'), -5n)
    assert.equal(toBigInt('1e3'), 1000n) // exponent
    assert.equal(toBigInt('12.00'), 12n) // integral decimal
    assert.equal(toBigInt('1.2300E2'), 123n)
    assert.equal(toBigInt('9007199254740993'), 9007199254740993n) // lossless
    assert.throws(() => toBigInt(''), SyntaxError) // no longer 0n
    assert.throws(() => toBigInt('   '), SyntaxError)
    assert.throws(() => toBigInt('1.5'), SyntaxError) // real fraction
  })

  test('toBigInt() converts numeric wrapper objects via toString()', () => {
    // stand-in for a BigNumber / Decimal128: an object whose toString() is a
    // numeric string
    const decimal = (s: string) => ({ toString: () => s })
    assert.equal(toBigInt(decimal('12345')), 12345n)
    assert.equal(toBigInt(decimal('12345.00')), 12345n) // integral despite the fraction
    assert.equal(toBigInt(decimal('1E3')), 1000n)
    assert.equal(toBigInt(Object(5)), 5n) // boxed Number
    assert.throws(() => toBigInt(decimal('12345.67')), TypeError) // lossy
    assert.throws(() => toBigInt([]), TypeError) // arrays rejected (not 0n)
    assert.throws(() => toBigInt([5]), TypeError) // arrays rejected (not 5n)
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

  test('toNumber() converts wrapper objects and rejects the empty/array footguns', () => {
    const decimal = (s: string) => ({ toString: () => s })
    assert.equal(toNumber(decimal('12345.67')), 12345.67) // fractions are fine
    assert.equal(toNumber(decimal('1E3')), 1000)
    assert.equal(toNumber(Object(5)), 5) // boxed Number
    assert.equal(toNumber(10n), 10) // bigint
    assert.throws(() => toNumber(''), TypeError) // no longer 0
    assert.throws(() => toNumber('   '), TypeError)
    assert.throws(() => toNumber([]), TypeError) // no longer 0
    assert.throws(() => toNumber([5]), TypeError) // no longer 5
    assert.throws(() => toNumber({}), TypeError)
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
