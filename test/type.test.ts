import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { sleep } from '../src/misc.js'
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
  PickRequired,
  PickPartial,
  MixRequiredPartial,
  TypeOrNil,
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
  test('toBigInt()', async () => {
    const x = toBigInt(12345)
    assert.equal(typeof x, 'bigint')
    assert.equal(x, x)
    assert.equal(x, 12345n)
    assert.notEqual(x, 23456)
    assert.notEqual(x, '23456')
  })

  test('toBigInt() with error thrown', () => {
    assert.throws(() => toBigInt(), SyntaxError)
    assert.throws(() => toBigInt('foobar'), SyntaxError)
    assert.throws(() => toBigInt(1.234), RangeError)
  })

  test('toBigIntOrNil()', () => {
    assert.equal(toBigIntOrNil(null), Nil)
    assert.equal(toBigIntOrNil(Nil), Nil)
    assert.equal(typeof toBigIntOrNil(0n), 'bigint')
  })

  test('JSON.stringify() for bigint', () => {
    assert.equal(JSON.stringify({ a: 123n }), '{"a":"123"}')
  })
})

describe('date', () => {
  test('toDate()', async () => {
    const x = toDate()
    await wait()
    assert.equal(x instanceof Date, true)
    assert.notEqual(x.getTime(), toDate().getTime())
  })

  test('toDateOrNil()', async () => {
    assert.equal(toDateOrNil(null), Nil)
    assert.equal(toDateOrNil(Nil), Nil)
    const x = toDate()
    await wait()
    assert.notEqual(toDateOrNil(x)?.getTime(), new Date()?.getTime())
  })
})

describe('number', () => {
  test('toNumber()', async () => {
    assert.equal(toNumber(123), 123)
    assert.equal(toNumber('123'), 123)
    assert.notEqual(toNumber(123), 456)
  })

  test('toNumberOrNil()', async () => {
    assert.equal(toNumberOrNil(Nil), Nil)
    assert.equal(toNumberOrNil(null), Nil)
    assert.equal(toNumberOrNil(123), 123)
    assert.equal(toNumberOrNil('123'), 123)
    assert.notEqual(toNumberOrNil(123), 456)
  })
})

describe('string', () => {
  test('toString()', async () => {
    assert.equal(toString(123), '123')
    assert.notEqual(toString(123), '456')
  })

  test('toStringOrNil()', async () => {
    assert.equal(toStringOrNil(Nil), Nil)
    assert.equal(toStringOrNil(null), Nil)
    assert.equal(toStringOrNil(123), '123')
    assert.notEqual(toStringOrNil(123), '456')
  })
})

async function wait(): Promise<void> {
  await sleep(10)
}
