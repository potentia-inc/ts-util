import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { TimeoutAbortController } from '../src/abort-controller.js'
import { sleep } from '../src/misc.js'

describe('AbortController', () => {
  test('TimeoutAbortController: aborted already', () => {
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

  test('TimeoutAbortController: signal aborted', () => {
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

  test('TimeoutAbortController: timeout (milliseconds)', async () => {
    const timeouter = new TimeoutAbortController({ timeout: 10 })
    assert.equal(timeouter.signal.aborted, false)
    await sleep(30)
    assert.equal(timeouter.signal.aborted, true)
    assert.equal(
      (timeouter.signal.reason as { name?: string })?.name,
      'TimeoutError',
    )
  })

  test('TimeoutAbortController: abort() called', () => {
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
