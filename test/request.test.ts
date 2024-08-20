import assert from 'node:assert'
import { RequestListener, createServer } from 'node:http'
import { request } from '../src/index.js'

describe('request', () => {
  test('request()', async () => {
    const { link, stop } = await start()
    const res = await request(link)
    expect(res.status).toBe(200)
    await stop()
  })

  test('request() with timeout error', async () => {
    const { link, stop } = await start({ timeout: 10000 })
    await expect(request(link, { timeout: 1 })).rejects.toThrow(/timeout/)
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
      } catch (err) {
        // supress the errors
      }
      res.writeHead(401)
    }
    const { link, stop } = await start({ exec })

    // no credential
    expect((await request(link)).status).toBe(401)

    // wrong credential
    const url = new URL(link)
    url.username = 'ooo'
    url.password = 'xxx'
    expect((await request(url.toString())).status).toBe(401)

    // correct credential
    url.username = username
    url.password = password
    expect((await request(url.toString())).status).toBe(200)

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
