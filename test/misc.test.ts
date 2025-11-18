import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { option, sleep, msleep, ssleep } from '../src/misc.js'
import { Nil } from '../src/type.js'

describe('option', () => {
  test('option()', () => {
    assert.deepEqual(option('foo', 'bar'), { foo: 'bar' })
    assert.deepEqual({ ...option('foo', 'bar') }, { foo: 'bar' })
  })

  test('option() with nil value', () => {
    assert.equal(option('foo', Nil), undefined)
    assert.equal(option('bar', null), undefined)
    assert.deepEqual({ ...option('bar', Nil) }, {})
  })
})

describe('sleep', () => {
  test('sleep', async () => {
    const ms = 100
    const now = Date.now()
    await sleep(ms)
    const duration = Date.now() - now
    assert.equal(Math.abs(duration - ms) <= 0.1 * ms, true)
  })

  test('ssleep', async () => {
    const s = 0.1
    const now = Date.now()
    assert.equal(await ssleep(s), true)
    const duration = Date.now() - now
    assert.equal(Math.abs(duration / 1000 - s) <= 0.1 * s, true)
    assert.equal(await ssleep(0.0005), false)
    assert.equal(await ssleep(2147483.648), false)
    assert.equal(await ssleep(NaN), false)
  })

  test('msleep', async () => {
    const ms = 100
    const now = Date.now()
    assert.equal(await msleep(ms), true)
    const duration = Date.now() - now
    assert.equal(Math.abs(duration - ms) <= 0.1 * ms, true)
    assert.equal(await msleep(0.5), false)
    assert.equal(await msleep(2147483648), false)
    assert.equal(await msleep(NaN), false)
  })
})
