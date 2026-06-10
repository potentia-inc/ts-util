// Framework-free cross-runtime smoke test. Uses only node:assert and top-level
// await (no describe/test), so it runs identically on Node, Bun and Deno —
// unlike the node:test suite, which Bun cannot run (oven-sh/bun#5090).
//
// Exercises the built artifact (dist) so it also covers the runtime's node:
// builtin implementations (node:crypto, Buffer, timers, AbortSignal).
//
//   node smoke.mjs   |   bun smoke.mjs   |   deno run -A smoke.mjs
import assert from 'node:assert/strict'
import { generateKeyPairSync } from 'node:crypto'
import {
  Nil,
  isNullish,
  toBigInt,
  toNumber,
  toMs,
  sleep,
  msleep,
  ssleep,
  sign,
  verify,
  PromiseTracker,
  TimeoutAbortController,
  createHTTPError,
  NotFoundError,
  getMessage,
  fetch as fetchWrapper,
} from './dist/src/index.js'

const runtime =
  typeof globalThis.Bun !== 'undefined'
    ? 'bun'
    : typeof globalThis.Deno !== 'undefined'
      ? 'deno'
      : 'node'

// types / coercions
assert.equal(toBigInt('5'), 5n)
assert.throws(() => toBigInt(), TypeError)
assert.equal(toNumber('3'), 3)
assert.equal(isNullish(Nil), true)

// duration
assert.equal(toMs('5s'), 5000)
assert.equal(toMs(100), 100)
assert.throws(() => toMs('5m'), RangeError)

// signature — cross-runtime node:crypto must produce identical bytes
const message = 'The quick brown fox jumps over the lazy dog'
const hmacKey = {
  algorithm: 'hmac',
  hash: 'sha256',
  key: new TextEncoder().encode('key'),
}
const mac = await sign(hmacKey, message)
assert.equal(
  Buffer.from(mac).toString('hex'),
  'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8',
)
assert.equal(await verify(hmacKey, message, mac), true)

// ed25519 — asymmetric node:crypto must round-trip on every runtime
const ed = generateKeyPairSync('ed25519')
const edSig = await sign(
  {
    algorithm: 'ed25519',
    key: ed.privateKey.export({ type: 'pkcs8', format: 'der' }),
  },
  message,
)
assert.equal(
  await verify(
    {
      algorithm: 'ed25519',
      key: ed.publicKey.export({ type: 'spki', format: 'der' }),
    },
    message,
    edSig,
  ),
  true,
)

// sleep / Duration / cancellation
const started = Date.now()
await sleep('30ms')
assert.ok(Date.now() - started >= 25)
await msleep(5)
await ssleep(0.005)
await assert.rejects(sleep(10_000, { signal: AbortSignal.abort() }))

// TimeoutAbortController
const controller = new TimeoutAbortController({ timeout: '10ms' })
await sleep(40)
assert.equal(controller.signal.aborted, true)

// PromiseTracker
const tracker = new PromiseTracker(Promise.resolve(1))
await Promise.resolve()
assert.equal(tracker.isSettled, true)

// errors
assert.equal(createHTTPError(404).status, 404)
assert.ok(new NotFoundError() instanceof Error)
assert.equal(getMessage(new Error('x')), 'x')
assert.equal(typeof fetchWrapper, 'function')

// the bigint json patch is opt-in
assert.throws(() => JSON.stringify(1n), TypeError)
await import('./dist/src/patch/bigint/json.js')
assert.equal(JSON.stringify(1n), '"1"')

console.log(`SMOKE OK (${runtime})`)
