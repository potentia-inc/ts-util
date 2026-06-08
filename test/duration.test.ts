import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { toMs, type Duration } from '../src/duration.js'

describe('duration', () => {
  test('toMs() with a number is milliseconds', () => {
    assert.equal(toMs(0), 0)
    assert.equal(toMs(100), 100)
    assert.equal(toMs(0.5), 0.5) // sub-ms via a fraction
  })

  test('toMs() parses the ms and s suffixes', () => {
    assert.equal(toMs('100ms'), 100)
    assert.equal(toMs('5s'), 5000)
    assert.equal(toMs('1.5s'), 1500)
    assert.equal(toMs('0.5ms'), 0.5)
  })

  test('toMs() throws on bare, reserved or invalid units', () => {
    assert.throws(() => toMs('100' as Duration), RangeError) // bare number string
    assert.throws(() => toMs('5m' as Duration), RangeError) // reserved (use 'min' later)
    assert.throws(() => toMs('5min' as Duration), RangeError) // reserved
    assert.throws(() => toMs('5h' as Duration), RangeError) // reserved
    assert.throws(() => toMs('5us' as Duration), RangeError) // reserved
    assert.throws(() => toMs('foo' as Duration), RangeError)
  })
})
