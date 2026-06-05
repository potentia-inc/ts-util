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
  test('sleep() with a number (milliseconds)', async () => {
    const now = Date.now()
    await sleep(100)
    assert.equal(Date.now() - now >= 90, true)
  })

  test('sleep() with a string duration', async () => {
    const a = Date.now()
    await sleep('100ms')
    assert.equal(Date.now() - a >= 90, true)
    const b = Date.now()
    await sleep('0.1s')
    assert.equal(Date.now() - b >= 90, true)
  })

  test('sleep() throws RangeError on an invalid delay', async () => {
    await assert.rejects(sleep(NaN), RangeError)
    await assert.rejects(sleep(-1), RangeError)
    await assert.rejects(sleep(2147483648), RangeError)
  })

  test('sleep() is cancellable via signal', async () => {
    await assert.rejects(sleep(10_000, { signal: AbortSignal.abort() }))
  })

  test('msleep() and ssleep()', async () => {
    const a = Date.now()
    await msleep(50)
    assert.equal(Date.now() - a >= 40, true)
    const b = Date.now()
    await ssleep(0.05)
    assert.equal(Date.now() - b >= 40, true)
  })
})
