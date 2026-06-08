import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { createServer, type RequestListener } from 'node:http'
import { fetch } from '../src/index.js'

describe('fetch', () => {
  test('fetch()', async () => {
    const { link, stop } = await start()
    const res = await fetch(link)
    assert.equal(res.status, 200)
    await stop()
  })

  test('fetch() with timeout error', async () => {
    const { link, stop } = await start({ timeout: 10000 })
    await assert.rejects(fetch(link, { timeout: 1 }), /timeout/)
    await stop()
  })

  test('fetch() with credential', async () => {
    const username = 'foo'
    const password = 'bar'
    const exec: RequestListener = (req, res) => {
      try {
        const authorization = req.headers['authorization']
        const prefix = 'Basic '
        if (
          typeof authorization === 'string' &&
          authorization.startsWith(prefix)
        ) {
          const credential = Buffer.from(
            authorization.substring(prefix.length),
            'base64',
          ).toString('utf8')
          if (credential === `${username}:${password}`) return
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // supress the errors
      }
      res.writeHead(401)
    }
    const { link, stop } = await start({ exec })

    // no credential
    assert.equal((await fetch(link)).status, 401)

    // wrong credential
    const url = new URL(link)
    url.username = 'ooo'
    url.password = 'xxx'
    assert.equal((await fetch(url.toString())).status, 401)

    // correct credential
    url.username = username
    url.password = password
    assert.equal((await fetch(url.toString())).status, 200)

    await stop()
  })

  test('fetch() merges a caller signal with the timeout', async () => {
    const { link, stop } = await start({ timeout: 10000 })
    // both a caller signal (already aborted) and a timeout are provided
    await assert.rejects(
      fetch(link, { timeout: 10000, signal: AbortSignal.abort() }),
    )
    await stop()
  })

  test('fetch() preserves caller headers and password-only credentials', async () => {
    let header: string | undefined
    let authorization: string | undefined
    const exec: RequestListener = (req) => {
      header = req.headers['x-test'] as string | undefined
      authorization = req.headers['authorization'] as string | undefined
    }
    const { link, stop } = await start({ exec })
    const url = new URL(link)
    url.password = 'secret' // password, no username
    await fetch(url.toString(), { headers: { 'x-test': 'kept' } })
    assert.equal(header, 'kept') // caller header preserved
    assert.equal(
      authorization,
      `Basic ${Buffer.from(':secret').toString('base64')}`,
    )
    await stop()
  })
})

async function start({
  exec = () => {},
  timeout = 0,
}: {
  exec?: RequestListener
  timeout?: number
} = {}): Promise<{
  link: string
  stop: () => Promise<void>
}> {
  const server = createServer((req, res) => {
    setTimeout(() => {
      exec(req, res)
      res.end()
    }, timeout)
  })
  const net = server.listen()
  const address = net.address()
  assert(address !== null && typeof address !== 'string')
  return {
    link: `http://localhost:${address.port}`,
    stop: () =>
      new Promise((resolve, reject) =>
        server.close((err) => {
          if (err) reject(err)
          else resolve()
        }),
      ),
  }
}
