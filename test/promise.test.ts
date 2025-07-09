import { setImmediate } from 'node:timers/promises'

import { ssleep } from '../src/misc.js'
import { PromiseTracker } from '../src/promise.js'
import { Nil } from '../src/type.js'

describe('PromiseTracker', () => {
  test('PromiseTracker: already resolved', async () => {
    const tracker = new PromiseTracker(Promise.resolve(Nil))
    expect(tracker.isSettled).toBe(false)
    await setImmediate()
    expect(tracker.isSettled).toBe(true)
  })

  test('PromiseTracker', async () => {
    const tracker = new PromiseTracker(
      new Promise((resolve) => {
        ssleep(1).then(() => resolve(Nil))
      }),
    )
    expect(tracker.isSettled).toBe(false)
    await ssleep(1)
    expect(tracker.isSettled).toBe(true)
    expect(await tracker.promise).toBe(Nil)
  })
})
