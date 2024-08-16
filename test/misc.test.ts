import { option, sleep } from '../src/misc.js'
import { NIL } from '../src/type.js'

describe('option', () => {
  test('option()', () => {
    expect(option('foo', 'bar')).toEqual({ foo: 'bar' })
    expect({ ...option('foo', 'bar') }).toEqual({ foo: 'bar' })
  })

  test('option() with nil value', () => {
    expect(option('foo', NIL)).toBeUndefined()
    expect(option('bar', null)).toBeUndefined()
    expect({ ...option('bar', NIL) }).toEqual({})
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
})
