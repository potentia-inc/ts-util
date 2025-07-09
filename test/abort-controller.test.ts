import { TimeoutAbortController } from '../src/abort-controller.js'
import { ssleep } from '../src/misc.js'

describe('AbortController', () => {
  test('TimeoutAbortController: aborted already', async () => {
    const aborter = new AbortController()
    expect(aborter.signal.aborted).toBe(false)
    aborter.abort()
    expect(aborter.signal.aborted).toBe(true)
    const timeouter = new TimeoutAbortController({
      signal: aborter.signal,
      timeout: 1,
    })
    expect(timeouter.signal.aborted).toBe(true)
  })

  test('TimeoutAbortController: signal aborted', async () => {
    const aborter = new AbortController()
    const timeouter = new TimeoutAbortController({
      signal: aborter.signal,
      timeout: 10000,
    })
    expect(aborter.signal.aborted).toBe(false)
    expect(timeouter.signal.aborted).toBe(false)
    aborter.abort()
    expect(aborter.signal.aborted).toBe(true)
    expect(timeouter.signal.aborted).toBe(true)
  })

  test('TimeoutAbortController: timeout', async () => {
    const aborter = new AbortController()
    const timeouter = new TimeoutAbortController({
      signal: aborter.signal,
      timeout: 1,
    })
    expect(aborter.signal.aborted).toBe(false)
    expect(timeouter.signal.aborted).toBe(false)
    await ssleep(2)
    expect(aborter.signal.aborted).toBe(false)
    expect(timeouter.signal.aborted).toBe(true)
  })

  test('TimeoutAbortController: abort() called', async () => {
    const aborter = new AbortController()
    const timeouter = new TimeoutAbortController({
      signal: aborter.signal,
      timeout: 1000,
    })
    expect(aborter.signal.aborted).toBe(false)
    expect(timeouter.signal.aborted).toBe(false)
    timeouter.abort()
    expect(aborter.signal.aborted).toBe(false)
    expect(timeouter.signal.aborted).toBe(true)
  })
})
