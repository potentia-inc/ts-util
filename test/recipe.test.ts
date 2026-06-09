import assert from 'node:assert'
import { createServer } from 'node:http'
import { describe, test } from 'node:test'
import { createDispatcher } from '../src/dispatcher.js'
import { fetch } from '../src/fetch.js'
import {
  createLogger,
  prettyFormat,
  type Level,
  type LogRecord,
  type Sink,
} from '../src/logger.js'

// These are the README "Recipes" — copy them into your own project and swap the
// '../src/*.js' imports for '@potentia/util/*'. They live here as fixtures so
// the documented pattern is verified against the real dispatcher/fetch/Sink
// contract on every run.

// Google Chat incoming webhook.
function gchatSink(options: { url: string; level?: Level }): Sink {
  const dispatcher = createDispatcher<LogRecord>(
    async (records) => {
      const text = records.map(prettyFormat).join('\n')
      const res = await fetch(options.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
        timeout: '30s',
      })
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
    },
    { maxBatch: 20, maxWait: '2s', retries: 3 },
  )
  return {
    level: options.level,
    handle: (record) => dispatcher.push(record),
    flush: () => dispatcher.flush(),
    close: () => dispatcher.close(),
  }
}

// Slack incoming webhook — same shape, a different payload.
function slackSink(options: { url: string; level?: Level }): Sink {
  const dispatcher = createDispatcher<LogRecord>(
    async (records) => {
      const text = records.map((r) => `*${r.level}* ${r.message}`).join('\n')
      const res = await fetch(options.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
        timeout: '30s',
      })
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
    },
    { maxBatch: 20, maxWait: '2s', retries: 3 },
  )
  return {
    level: options.level,
    handle: (record) => dispatcher.push(record),
    flush: () => dispatcher.flush(),
    close: () => dispatcher.close(),
  }
}

describe('recipe: webhook alert sinks', () => {
  test('gchat sink batches error+ records into one POST', async () => {
    const srv = await start()
    const log = createLogger({
      name: 'app',
      level: 'trace',
      console: false,
      sinks: [gchatSink({ url: srv.url, level: 'error' })],
    })
    log.info('ignored') // below the sink's level
    log.error('boom', { code: 1 })
    log.fatal('dead')
    await log.close() // flush + close
    await srv.stop()
    assert.equal(srv.bodies.length, 1) // both alerts coalesced into one request
    const payload = JSON.parse(srv.bodies[0]) as { text: string }
    assert.match(payload.text, /boom/)
    assert.match(payload.text, /dead/)
    assert.doesNotMatch(payload.text, /ignored/)
  })

  test('slack sink posts its own payload shape', async () => {
    const srv = await start()
    const log = createLogger({
      name: 'app',
      console: false,
      sinks: [slackSink({ url: srv.url })],
    })
    log.error('kaboom')
    await log.close()
    await srv.stop()
    assert.equal(srv.bodies.length, 1)
    const payload = JSON.parse(srv.bodies[0]) as { text: string }
    assert.match(payload.text, /\*error\* kaboom/)
  })

  test('retries when the webhook returns 5xx', async () => {
    const srv = await start(1) // fail the first request, then succeed
    const log = createLogger({
      name: 'app',
      console: false,
      sinks: [gchatSink({ url: srv.url })],
    })
    log.error('flaky')
    await log.close()
    await srv.stop()
    assert.ok(srv.calls() >= 2, `expected a retry, got ${srv.calls()} call(s)`)
    const last = JSON.parse(srv.bodies[srv.bodies.length - 1]) as {
      text: string
    }
    assert.match(last.text, /flaky/)
  })
})

async function start(failures = 0): Promise<{
  url: string
  bodies: string[]
  calls: () => number
  stop: () => Promise<void>
}> {
  const bodies: string[] = []
  let calls = 0
  const server = createServer((req, res) => {
    const n = ++calls
    const chunks: string[] = []
    req.setEncoding('utf8')
    req
      .on('data', (c: string) => chunks.push(c))
      .on('end', () => {
        bodies.push(chunks.join(''))
        res.writeHead(n <= failures ? 500 : 200).end()
      })
  })
  await new Promise<void>((resolve) => server.listen(0, resolve))
  const address = server.address()
  assert(address !== null && typeof address !== 'string')
  return {
    url: `http://127.0.0.1:${address.port}`,
    bodies,
    calls: () => calls,
    stop: () =>
      new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      ),
  }
}
