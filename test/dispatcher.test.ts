import assert from 'node:assert'
import { describe, test } from 'node:test'
import { createDispatcher } from '../src/dispatcher.js'

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

describe('dispatcher', () => {
  test('default: one send per item, in order', async () => {
    const batches: number[][] = []
    const d = createDispatcher<number>(async (items) => {
      batches.push(items)
    })
    for (const n of [1, 2, 3]) d.push(n)
    await d.flush()
    assert.deepEqual(batches, [[1], [2], [3]])
  })

  test('batches never exceed maxBatch, deliver all, in order', async () => {
    const batches: number[][] = []
    const d = createDispatcher<number>(
      async (items) => {
        batches.push(items)
      },
      { maxBatch: 3 },
    )
    const input = Array.from({ length: 7 }, (_, i) => i)
    for (const n of input) d.push(n)
    await d.flush()
    assert.ok(
      batches.every((b) => b.length <= 3),
      'no batch exceeds maxBatch',
    )
    assert.ok(
      batches.some((b) => b.length > 1),
      'at least one batch coalesced',
    )
    assert.deepEqual(batches.flat(), input)
  })

  test('maxWait coalesces a partial batch', async () => {
    const batches: number[][] = []
    const d = createDispatcher<number>(
      async (items) => {
        batches.push(items)
      },
      { maxBatch: 10, maxWait: '40ms' },
    )
    d.push(1)
    d.push(2)
    d.push(3)
    assert.equal(batches.length, 0, 'nothing sent before the wait elapses')
    await sleep(120)
    assert.deepEqual(batches, [[1, 2, 3]])
  })

  test('retries a failing send then succeeds', async () => {
    let attempts = 0
    const errors: unknown[] = []
    const d = createDispatcher<string>(
      async () => {
        attempts++
        if (attempts < 3) throw new Error('boom')
      },
      { retries: 2, onError: (e) => errors.push(e) },
    )
    d.push('x')
    await d.flush()
    assert.equal(attempts, 3)
    assert.equal(errors.length, 0)
  })

  test('gives up after retries are exhausted and calls onError', async () => {
    let attempts = 0
    const errors: unknown[] = []
    const d = createDispatcher<string>(
      async () => {
        attempts++
        throw new Error('always')
      },
      { retries: 1, onError: (e, items) => errors.push([e, items]) },
    )
    d.push('x')
    await d.flush()
    assert.equal(attempts, 2) // 1 try + 1 retry
    assert.equal(errors.length, 1)
  })

  test('shouldRetry=false skips retries', async () => {
    let attempts = 0
    let onError = 0
    const d = createDispatcher<string>(
      async () => {
        attempts++
        throw new Error('nope')
      },
      { retries: 5, shouldRetry: () => false, onError: () => onError++ },
    )
    d.push('x')
    await d.flush()
    assert.equal(attempts, 1)
    assert.equal(onError, 1)
  })

  test('bounded queue drops oldest and reports them', async () => {
    const sent: string[] = []
    const dropped: string[] = []
    let release!: () => void
    const gate = new Promise<void>((r) => (release = r))
    let first = true
    const d = createDispatcher<string>(
      async (items) => {
        if (first) {
          first = false
          await gate // hold the first send so the queue backs up
        }
        sent.push(...items)
      },
      { maxQueue: 3, onDrop: (items) => dropped.push(...items) },
    )
    d.push('A') // taken immediately, blocks on the gate
    for (const x of ['B', 'C', 'D', 'E', 'F']) d.push(x) // queue caps at 3
    release()
    await d.flush()
    assert.deepEqual(dropped, ['B', 'C'])
    assert.deepEqual(sent, ['A', 'D', 'E', 'F'])
  })

  test('minInterval spaces out sends', async () => {
    const times: number[] = []
    const d = createDispatcher<number>(
      async () => {
        times.push(Date.now())
      },
      { minInterval: '40ms' },
    )
    d.push(1)
    d.push(2)
    d.push(3)
    await d.flush()
    assert.equal(times.length, 3)
    assert.ok(times[1] - times[0] >= 30, `gap0 ${times[1] - times[0]}`)
    assert.ok(times[2] - times[1] >= 30, `gap1 ${times[2] - times[1]}`)
  })

  test('flush resolves only once everything is delivered', async () => {
    const sent: number[] = []
    const d = createDispatcher<number>(async (items) => {
      await sleep(10)
      sent.push(...items)
    })
    for (const n of [1, 2, 3]) d.push(n)
    await d.flush()
    assert.deepEqual(sent, [1, 2, 3])
  })

  test('close drains then ignores further pushes', async () => {
    const sent: number[] = []
    const d = createDispatcher<number>(async (items) => {
      sent.push(...items)
    })
    d.push(1)
    d.push(2)
    await d.close()
    d.push(3) // ignored after close
    await d.flush()
    assert.deepEqual(sent, [1, 2])
  })

  test('backoff function delays retries with the attempt number', async () => {
    let attempts = 0
    const seen: number[] = []
    const d = createDispatcher<string>(
      async () => {
        attempts++
        if (attempts < 3) throw new Error('x')
      },
      {
        retries: 2,
        backoff: (n) => {
          seen.push(n)
          return '5ms'
        },
      },
    )
    d.push('a')
    await d.flush()
    assert.equal(attempts, 3)
    assert.deepEqual(seen, [1, 2]) // 1-based attempt numbers
  })

  test('misbehaving onError does not break the pump', async () => {
    const sent: string[] = []
    const d = createDispatcher<string>(
      async (items) => {
        if (items[0] === 'bad') throw new Error('boom')
        sent.push(...items)
      },
      {
        onError: () => {
          throw new Error('bad onError')
        },
      },
    )
    d.push('bad') // send throws -> onError throws -> swallowed
    d.push('good')
    await d.flush() // must still resolve, and 'good' still delivered
    assert.deepEqual(sent, ['good'])
  })

  test('misbehaving onDrop does not break push', async () => {
    const sent: string[] = []
    let release!: () => void
    const gate = new Promise<void>((r) => (release = r))
    let first = true
    const d = createDispatcher<string>(
      async (items) => {
        if (first) {
          first = false
          await gate
        }
        sent.push(...items)
      },
      {
        maxQueue: 1,
        onDrop: () => {
          throw new Error('bad onDrop')
        },
      },
    )
    d.push('A') // taken, blocks on the gate
    d.push('B') // queued (at cap)
    d.push('C') // overflow -> drops 'B', onDrop throws but is swallowed
    release()
    await d.flush()
    assert.deepEqual(sent, ['A', 'C'])
  })

  test('flush expedites a debounced batch (no full maxWait)', async () => {
    const batches: number[][] = []
    const d = createDispatcher<number>(
      async (items) => {
        batches.push(items)
      },
      { maxBatch: 10, maxWait: '1s' },
    )
    d.push(1)
    d.push(2)
    await d.flush() // must not wait the full 1s
    assert.deepEqual(batches, [[1, 2]])
  })

  test('close expedites a debounced batch', async () => {
    const batches: number[][] = []
    const d = createDispatcher<number>(
      async (items) => {
        batches.push(items)
      },
      { maxBatch: 10, maxWait: '1s' },
    )
    d.push(1)
    await d.close()
    assert.deepEqual(batches, [[1]])
  })

  test('flush waits for an in-flight send even with an empty queue', async () => {
    const sent: number[] = []
    let release!: () => void
    const gate = new Promise<void>((r) => (release = r))
    const d = createDispatcher<number>(async (items) => {
      await gate
      sent.push(...items)
    })
    d.push(1) // taken immediately: sending, queue now empty
    let done = false
    const flushed = d.flush().then(() => (done = true))
    await sleep(10)
    assert.equal(done, false) // queue empty but a send is in flight
    release()
    await flushed
    assert.deepEqual(sent, [1])
  })

  test('re-wakes from idle for later pushes', async () => {
    const sent: number[] = []
    const d = createDispatcher<number>(async (items) => {
      sent.push(...items)
    })
    d.push(1)
    await d.flush() // drains, then the pump parks idle
    await sleep(20)
    d.push(2) // must re-wake the parked pump
    await d.flush()
    assert.deepEqual(sent, [1, 2])
  })
})
