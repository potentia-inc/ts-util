import assert from 'node:assert'
import { createServer } from 'node:http'
import { request } from '../src/index.js'

describe('request', () => {
  test('request()', async () => {
    const { link, stop } = await start()
    const res = await request(link)
    expect(res.status).toBe(200)
    await stop()
  })

  test('request() with timeout error', async () => {
    const { link, stop } = await start(10000)
    await expect(request(link, { timeout: 1 })).rejects.toThrow(/timeout/)
    await stop()
  })
})

async function start(ms: number = 0): Promise<{
  link: string
  stop: () => Promise<void>
}> {
  const server = createServer((req, res) => {
    setTimeout(() => res.end(), ms)
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
