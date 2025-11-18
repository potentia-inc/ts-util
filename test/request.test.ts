import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { RequestListener, createServer } from 'node:http'
import { request } from '../src/index.js'

describe('request', () => {
  test('request()', async () => {
    const { link, stop } = await start()
    const res = await request(link)
    assert.equal(res.status, 200)
    await stop()
  })

  test('request() with timeout error', async () => {
    const { link, stop } = await start({ timeout: 10000 })
    await assert.rejects(request(link, { timeout: 1 }), /timeout/)
    await stop()
  })

  test('request() with credential', async () => {
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
    assert.equal((await request(link)).status, 401)

    // wrong credential
    const url = new URL(link)
    url.username = 'ooo'
    url.password = 'xxx'
    assert.equal((await request(url.toString())).status, 401)

    // correct credential
    url.username = username
    url.password = password
    assert.equal((await request(url.toString())).status, 200)

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
