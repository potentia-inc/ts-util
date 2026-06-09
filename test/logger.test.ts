import assert from 'node:assert'
import { describe, test } from 'node:test'
import {
  createLogger,
  jsonFormat,
  prettyFormat,
  type LogRecord,
  type Sink,
} from '../src/logger.js'

function capture(): { sink: Sink; records: LogRecord[] } {
  const records: LogRecord[] = []
  return { sink: { handle: (r) => records.push(r) }, records }
}

describe('logger', () => {
  test('emits at/above the level, drops below', () => {
    const { sink, records } = capture()
    const log = createLogger({ name: 't', sinks: [sink], console: false })
    log.trace('a')
    log.debug('b')
    log.info('c')
    log.warn('d')
    log.error('e')
    log.fatal('f')
    assert.deepEqual(
      records.map((r) => r.level),
      ['info', 'warn', 'error', 'fatal'], // default level 'info'
    )
  })

  test('custom level threshold', () => {
    const { sink, records } = capture()
    const log = createLogger({
      name: 't',
      level: 'error',
      sinks: [sink],
      console: false,
    })
    log.warn('w')
    log.error('e')
    assert.deepEqual(
      records.map((r) => r.message),
      ['e'],
    )
  })

  test('record shape and fields', () => {
    const { sink, records } = capture()
    const log = createLogger({ name: 'svc', sinks: [sink], console: false })
    log.info('hello')
    log.info('with', { a: 1, b: 'two' })
    assert.equal(records[0].name, 'svc')
    assert.equal(records[0].message, 'hello')
    assert.equal(records[0].level, 'info')
    assert.ok(records[0].time instanceof Date)
    assert.equal(records[0].fields, undefined)
    assert.deepEqual(records[1].fields, { a: 1, b: 'two' })
  })

  test('child merges bindings into every record', () => {
    const { sink, records } = capture()
    const log = createLogger({ name: 't', sinks: [sink], console: false })
    const child = log.child({ req: 7 })
    child.info('x', { extra: true })
    child.warn('y')
    assert.deepEqual(records[0].fields, { req: 7, extra: true })
    assert.deepEqual(records[1].fields, { req: 7 })
  })

  test('per-sink level filters independently', () => {
    const all = capture()
    const errs = capture()
    errs.sink.level = 'error'
    const log = createLogger({
      name: 't',
      level: 'trace',
      sinks: [all.sink, errs.sink],
      console: false,
    })
    log.info('i')
    log.error('e')
    assert.deepEqual(
      all.records.map((r) => r.message),
      ['i', 'e'],
    )
    assert.deepEqual(
      errs.records.map((r) => r.message),
      ['e'],
    )
  })

  test('flush and close fan out to sinks', async () => {
    let flushed = 0
    let closed = 0
    const sink: Sink = {
      handle: () => {},
      flush: async () => {
        flushed++
      },
      close: async () => {
        closed++
      },
    }
    const log = createLogger({ name: 't', sinks: [sink], console: false })
    await log.flush()
    assert.equal(flushed, 1)
    assert.equal(closed, 0)
    await log.close()
    assert.equal(flushed, 2) // close flushes first
    assert.equal(closed, 1)
  })

  test('console sink writes JSON to stdout / stderr by level (non-TTY)', () => {
    const out: string[] = []
    const err: string[] = []
    const origLog = console.log
    const origErr = console.error
    const stdout = process.stdout as { isTTY?: boolean }
    const origTTY = stdout.isTTY
    stdout.isTTY = false // force the non-TTY default -> jsonFormat
    console.log = (...a: unknown[]) => out.push(a.join(' '))
    console.error = (...a: unknown[]) => err.push(a.join(' '))
    try {
      const log = createLogger({ name: 'c', level: 'trace' })
      log.info('hi', { a: 1 })
      log.error('boom')
      assert.equal(out.length, 1)
      assert.equal(err.length, 1)
      assert.deepEqual(JSON.parse(out[0]), {
        level: 'info',
        time: JSON.parse(out[0]).time,
        name: 'c',
        message: 'hi',
        fields: { a: 1 },
      })
      assert.match(err[0], /"level":"error"/)
    } finally {
      console.log = origLog
      console.error = origErr
      stdout.isTTY = origTTY
    }
  })

  test('default format is pretty on a TTY', () => {
    const out: string[] = []
    const origLog = console.log
    const stdout = process.stdout as { isTTY?: boolean }
    const origTTY = stdout.isTTY
    stdout.isTTY = true // force the TTY default -> prettyFormat
    console.log = (...a: unknown[]) => out.push(a.join(' '))
    try {
      const log = createLogger({ name: 'tty' })
      log.info('hi')
      assert.match(out[0], /INFO {2}tty: hi/) // pretty line, not JSON
      assert.doesNotMatch(out[0], /^\{/)
    } finally {
      console.log = origLog
      stdout.isTTY = origTTY
    }
  })

  test('console sink honors an explicit format', () => {
    const out: string[] = []
    const origLog = console.log
    console.log = (...a: unknown[]) => out.push(a.join(' '))
    try {
      const log = createLogger({ name: 'p', format: prettyFormat })
      log.info('hi')
      assert.match(out[0], /INFO/)
      assert.match(out[0], /p: hi/)
    } finally {
      console.log = origLog
    }
  })

  test('format helpers', () => {
    const record: LogRecord = {
      level: 'info',
      time: new Date(0),
      name: 'n',
      message: 'm',
      fields: { a: 1 },
    }
    assert.equal(jsonFormat(record), JSON.stringify(record))
    const pretty = prettyFormat(record)
    assert.match(pretty, /INFO/)
    assert.match(pretty, /n: m/)
    assert.match(pretty, /\{"a":1\}/)
  })
})
