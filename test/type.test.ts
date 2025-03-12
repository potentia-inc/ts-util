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
import * as matchers from '../src/jest.js'

expect.extend(matchers)

describe('Nil', () => {
  test('Nil', () => {
    expect(Nil === undefined).toBeTruthy()
  })

  test('TypeOrNil<>', () => {
    class Foo {}
    type FooOrNil = TypeOrNil<Foo>
    const foo: FooOrNil = Nil
    expect(foo).toBeNil()
  })

  test('toBeNil()', () => {
    expect(Nil).toBeNil()
    expect(undefined).toBeNil()
    expect(null).not.toBeNil()
    expect(true).not.toBeNil()
    expect(false).not.toBeNil()
    expect(0).not.toBeNil()
    expect(0n).not.toBeNil()
    expect('').not.toBeNil()
  })
})

describe('type utility', () => {
  test('PickPartial', () => {
    type Foo = {
      a: string
      b: number
    }
    const foo: PickPartial<Foo, 'b'> = { a: 'bar' }
    expect(foo.a).toBe('bar')
    expect(foo.b).toBeUndefined()
  })

  test('PickRequired', () => {
    type Foo = {
      a?: string
      b?: number
    }
    const foo: PickRequired<Foo, 'a'> = { a: 'bar' }
    expect(foo.a).toBe('bar')
    expect(foo.b).toBeUndefined()
  })

  test('MixRequiredPartial', () => {
    type Foo = {
      a?: string
      b: number
      c: boolean
    }
    const foo: MixRequiredPartial<Foo, 'a', 'b'> = { a: 'bar', c: true }
    expect(foo.a).toBe('bar')
    expect(foo.b).toBeUndefined()
    expect(foo.c).toBe(true)
  })
})

describe('bigint', () => {
  test('toBigInt()', async () => {
    const x = toBigInt(12345)
    expect(x).toBeBigInt()
    expect(x).toEqualBigInt(x)
    expect(x).toEqualBigInt(12345)
    expect(x).toEqualBigInt('12345')
    expect(x).not.toEqualBigInt(23456)
    expect(x).not.toEqualBigInt('23456')
    expect(123).not.toBeBigInt()
    expect('123').not.toBeBigInt()
    expect(true).not.toBeBigInt()
    expect(null).not.toBeBigInt()
    expect(Nil).not.toBeBigInt()
  })

  test('toBigInt() with error thrown', () => {
    expect(() => toBigInt()).toThrow(SyntaxError)
    expect(() => toBigInt('foobar')).toThrow(SyntaxError)
    expect(() => toBigInt(1.234)).toThrow(RangeError)
  })

  test('toBigIntOrNil()', () => {
    expect(toBigIntOrNil(null)).toBeUndefined()
    expect(toBigIntOrNil(Nil)).toBeUndefined()
    expect(toBigIntOrNil(0n)).toBeBigInt()
  })

  test('JSON.stringify() for bigint', () => {
    expect(JSON.stringify({ a: 123n })).toBe('{"a":"123"}')
  })
})

describe('date', () => {
  it('toDate()', async () => {
    const x = toDate()
    await wait()
    expect(x).toEqualDate(x)
    expect(x).toEqualDate(x.getTime())
    expect(x).toEqualDate(x.toISOString())
    expect(x).not.toEqualDate(new Date())
    expect(toDate({ toString: () => x.toISOString() })).toEqualDate(x)
  })

  test('toDateOrNil()', async () => {
    expect(toDateOrNil(null)).toBeUndefined()
    expect(toDateOrNil(Nil)).toBeUndefined()
    const x = toDate()
    await wait()
    expect(toDateOrNil(x)).not.toEqualDate(new Date())
  })

  test('Timestamp', async () => {
    const x = toDate()
    await wait()
    const y = x.getTime()
    expect(y).toBeTimestamp()
    expect(y).toEqualTimestamp(x)
    expect(y).toEqualTimestamp(x.toISOString())
    expect(y).toEqualTimestamp(x.getTime())
    expect(y).not.toEqualTimestamp(new Date())
    expect(y).not.toEqualTimestamp(new Date().toISOString())
    expect(y).not.toEqualTimestamp(Date.now())

    expect(x).not.toBeTimestamp()
    expect('123').not.toBeTimestamp()
    expect(true).not.toBeTimestamp()
    expect(null).not.toBeTimestamp()
    expect(Nil).not.toBeTimestamp()
    expect(NaN).not.toEqualTimestamp(NaN)
    expect(NaN).not.toBeValidTimestamp()
    expect(Infinity).not.toBeValidTimestamp()
    expect(-Infinity).not.toBeValidTimestamp()
  })
})

describe('number', () => {
  it('toNumber()', async () => {
    expect(toNumber(123)).toBe(Number(123))
    expect(toNumber(123)).not.toBe(Number(456))
    expect(toNumber('456')).toBe(Number('456'))
    expect(toNumber('456')).not.toBe(Number('123'))
  })

  test('toNumberOrNil()', async () => {
    expect(toNumberOrNil(Nil)).toBeUndefined()
    expect(toNumberOrNil(null)).toBeUndefined()
    expect(toNumberOrNil(123)).toBe(Number(123))
    expect(toNumberOrNil(123)).not.toBe(Number(456))
    expect(toNumberOrNil('456')).toBe(Number('456'))
    expect(toNumberOrNil('456')).not.toBe(Number('123'))
  })
})

describe('string', () => {
  it('toString()', async () => {
    expect(toString(123)).toBe(String(123))
    expect(toString(123)).not.toBe(String(456))
    expect(toString('456')).toBe(String('456'))
    expect(toString('456')).not.toBe(String('123'))
  })

  test('toStringOrNil()', async () => {
    expect(toStringOrNil(Nil)).toBeUndefined()
    expect(toStringOrNil(null)).toBeUndefined()
    expect(toStringOrNil(123)).toBe(String(123))
    expect(toStringOrNil(123)).not.toBe(String(456))
    expect(toStringOrNil('456')).toBe(String('456'))
    expect(toStringOrNil('456')).not.toBe(String('123'))
  })
})

async function wait(): Promise<void> {
  await sleep(10)
}
