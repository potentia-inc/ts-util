import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { TimeoutAbortController } from '../src/abort-controller.js'
import { ssleep } from '../src/misc.js'

describe('AbortController', () => {
  test('TimeoutAbortController: aborted already', async () => {
    const aborter = new AbortController()
    assert.equal(aborter.signal.aborted, false)
    aborter.abort()
    assert.equal(aborter.signal.aborted, true)
    const timeouter = new TimeoutAbortController({
      signal: aborter.signal,
      timeout: 1,
    })
    assert.equal(timeouter.signal.aborted, true)
  })

  test('TimeoutAbortController: signal aborted', async () => {
    const aborter = new AbortController()
    const timeouter = new TimeoutAbortController({
      signal: aborter.signal,
      timeout: 10000,
    })
    assert.equal(aborter.signal.aborted, false)
    assert.equal(timeouter.signal.aborted, false)
    aborter.abort()
    assert.equal(aborter.signal.aborted, true)
    assert.equal(timeouter.signal.aborted, true)
  })

  test('TimeoutAbortController: timeout', async () => {
    const timeouter = new TimeoutAbortController({ timeout: 1 })
    assert.equal(timeouter.signal.aborted, false)
    await ssleep(2)
    assert.equal(timeouter.signal.aborted, true)
  })

  test('TimeoutAbortController: abort() called', async () => {
    const aborter = new AbortController()
    const timeouter = new TimeoutAbortController({
      signal: aborter.signal,
      timeout: 1000,
    })
    assert.equal(aborter.signal.aborted, false)
    assert.equal(timeouter.signal.aborted, false)
    timeouter.abort()
    assert.equal(aborter.signal.aborted, false)
    assert.equal(timeouter.signal.aborted, true)
  })
})
