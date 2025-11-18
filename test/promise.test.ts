import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { setImmediate } from 'node:timers/promises'

import { ssleep } from '../src/misc.js'
import { PromiseTracker } from '../src/promise.js'
import { Nil } from '../src/type.js'

describe('PromiseTracker', () => {
  test('PromiseTracker: already resolved', async () => {
    const tracker = new PromiseTracker(Promise.resolve(Nil))
    assert.equal(tracker.isSettled, false)
    await setImmediate()
    assert.equal(tracker.isSettled, true)
  })

  test('PromiseTracker', async () => {
    const tracker = new PromiseTracker(
      new Promise((resolve) => {
        ssleep(1).then(() => resolve(Nil))
      }),
    )
    assert.equal(tracker.isSettled, false)
    await ssleep(1)
    assert.equal(tracker.isSettled, true)
    assert.equal(await tracker.promise, Nil)
  })
})
