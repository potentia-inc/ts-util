import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { setImmediate } from 'node:timers/promises'

import { sleep } from '../src/misc.js'
import { PromiseTracker } from '../src/promise.js'
import { Nil } from '../src/type.js'

describe('PromiseTracker', () => {
  test('already resolved', async () => {
    const tracker = new PromiseTracker(Promise.resolve(Nil))
    assert.equal(tracker.isSettled, false)
    await setImmediate()
    assert.equal(tracker.isSettled, true)
  })

  test('resolves after a delay', async () => {
    const tracker = new PromiseTracker(sleep(20).then(() => 'done'))
    assert.equal(tracker.isSettled, false)
    await sleep(40)
    assert.equal(tracker.isSettled, true)
    assert.equal(await tracker.promise, 'done')
  })

  test('rejection settles without an unhandled rejection', async () => {
    const tracker = new PromiseTracker(Promise.reject(new Error('boom')))
    await setImmediate()
    assert.equal(tracker.isSettled, true)
    await assert.rejects(tracker.promise, /boom/)
  })
})
