import { option, sleep, msleep, ssleep } from '../src/misc.js'
import { Nil } from '../src/type.js'

describe('option', () => {
  test('option()', () => {
    expect(option('foo', 'bar')).toEqual({ foo: 'bar' })
    expect({ ...option('foo', 'bar') }).toEqual({ foo: 'bar' })
  })

  test('option() with nil value', () => {
    expect(option('foo', Nil)).toBeUndefined()
    expect(option('bar', null)).toBeUndefined()
    expect({ ...option('bar', Nil) }).toEqual({})
  })
})

describe('sleep', () => {
  test('sleep', async () => {
    const ms = 100
    const now = Date.now()
    await sleep(ms)
    const duration = Date.now() - now
    expect(Math.abs(duration - ms) <= 0.1 * ms).toBeTruthy()
  })

  test('ssleep', async () => {
    const s = 0.1
    const now = Date.now()
    expect(await ssleep(s)).toBe(true)
    const duration = Date.now() - now
    expect(Math.abs(duration / 1000 - s) <= 0.1 * s).toBeTruthy()
    expect(await ssleep(0.0005)).toBe(false)
    expect(await ssleep(2147483.648)).toBe(false)
  })

  test('msleep', async () => {
    const ms = 100
    const now = Date.now()
    expect(await msleep(ms)).toBe(true)
    const duration = Date.now() - now
    expect(Math.abs(duration - ms) <= 0.1 * ms).toBeTruthy()
    expect(await msleep(0.5)).toBe(false)
    expect(await msleep(2147483648)).toBe(false)
  })
})
