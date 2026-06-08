import { describe, expect, test } from 'bun:test'
import * as matchers from '../src/matcher/bun.js'

expect.extend(matchers)

describe('bun matchers', () => {
  test('toBeNil', () => {
    expect(undefined).toBeNil()
    expect(null).not.toBeNil()
    expect(0).not.toBeNil()
  })

  test('bigint', () => {
    expect(1n).toBeBigInt() // type
    expect(1).not.toBeBigInt()
    expect(1n).toBeBigInt(1) // equality via toBe
    expect(1n).toEqualBigInt('1') // equality via toEqual
    expect(1n).not.toEqualBigInt(2)
    expect(1n).not.toBeBigInt(undefined) // explicit undefined -> equality -> false
  })

  test('date', () => {
    const d = new Date()
    expect(d).toBeDate() // type
    expect(0).not.toBeDate()
    expect(d).toBeDate(d.getTime()) // equality via toBe
    expect(d).toEqualDate(d.toISOString())
    expect(d).not.toEqualDate(new Date(0))
  })

  test('timestamp', () => {
    const t = Date.now()
    expect(t).toBeTimestamp()
    expect('1').not.toBeTimestamp()
    expect(t).toBeTimestamp(t) // equality via toBe
    expect(t).toEqualTimestamp(t)
    expect(t).toBeValidTimestamp()
    expect(NaN).not.toBeValidTimestamp()
    expect('2020-01-01').toBeDateString()
    expect('garbage').not.toBeDateString()
  })
})
