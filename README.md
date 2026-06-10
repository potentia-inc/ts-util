# @potentia/util

A collection of cross-runtime utilities to make life easier.

- [types](#types): utilities for `undefined`, `bigint`, `Date`, `number` and
  `string`
- [duration](#duration): the `Duration` type (`number` ms, or `'5s'`/`'100ms'`)
  and `toMs()`
- [patches](#patches): opt-in prototype patches (currently `bigint` JSON
  serialization)
- [matchers](#matchers): [jest](https://jestjs.io), [bun:test](https://bun.sh/docs/cli/test)
  and [vitest](https://vitest.dev) matchers for `Nil`, `bigint`, `Date` and
  timestamps
- [fetch](#fetch):
  [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) wrapper
  with timeout and URL-credential support
- [signature](#signature): `sign`/`verify` over an algorithm-tagged key
- [error](#error): predefined HTTP error classes and utilities
- [promise](#promise): `Promise` related utilities
- [abort-controller](#abort-controller): `AbortController` related utilities
- [logger](#logger): a leveled logger (`trace`..`fatal`) with pluggable sinks
- [dispatcher](#dispatcher): a batched, retrying, fire-and-forget outbound queue
- [misc](#misc): other utilities

## Runtime support

Works on **Node.js (>= 22)**, **Bun** and **Deno (>= 2)**. The published package
ships compiled JavaScript plus type declarations; every module depends only on
web standards (`fetch`, `URL`, `AbortSignal`, `Uint8Array`) and `node:` built-ins
(`node:crypto`, `node:timers/promises`), all of which Bun and Deno implement.

The package has **no runtime dependencies**. The `./matcher/jest`,
`./matcher/bun` and `./matcher/vitest` entry points require the corresponding
test framework in your own project, but the rest of the package does not depend
on any of them.

```sh
npm install @potentia/util   # or: bun add / deno add npm:@potentia/util
```

## Types

`Nil` is an alias for `undefined`, used to keep the `...OrNil` naming short. The
package represents absence as `undefined`; use `isNullish(x)` to test for either
`null` or `undefined`.

```typescript
import { Nil, isNullish, type TypeOrNil } from '@potentia/util'
// or import { Nil, ... } from '@potentia/util/type'

assert(Nil === undefined) // Nil is the value alias of undefined
function returnNil(): Nil {
  // Nil is also the type alias of undefined
  return Nil
}
isNullish(null) // true
isNullish(undefined) // true
isNullish(0) // false
```

Type utilities to flip object fields between required and optional —
`PickRequired` makes the named fields required, `PickPartial` makes them
optional, and `MixRequiredPartial` does both in one step:

```typescript
import {
  type TypeOrNil,
  type PickRequired,
  type PickPartial,
  type MixRequiredPartial,
} from '@potentia/util'

type FooOrNil = TypeOrNil<Foo> // Foo | undefined

// pre-defined nil unions:
const a: BigIntOrNil = 0n // bigint | undefined
const b: DateOrNil = Nil // Date | undefined
const c: NumberOrNil = 0 // number | undefined
const d: StringOrNil = '' // string | undefined
const e: Uint8ArrayOrNil = Nil // Uint8Array | undefined
const f: NumStr = '123.456'
const g: NumStrOrNil = Nil // NumStr | undefined

type A = { a: string; b: number; c?: Date; d?: boolean }
type A1 = PickRequired<A, 'c' | 'd'> // c and d become required
type A2 = PickPartial<A, 'a'> // a becomes optional
type A3 = MixRequiredPartial<A, 'c' | 'd', 'a'> // c, d required; a optional
```

Coercions. The strict `toX()` functions **throw** a `TypeError` on `null`/
`undefined` and on unparseable input. The lenient `toXOrNil()` variants return
`Nil` for nullish input but still throw on genuinely invalid input.

```typescript
import {
  toBigInt,
  toBigIntOrNil,
  toDate,
  toDateOrNil,
  toNumber,
  toNumberOrNil,
  toString,
  toStringOrNil,
} from '@potentia/util'
// or import { toBigInt, ... } from '@potentia/util/type'

toNumber(0) // 0
toNumber('123') // 123
toNumber() // throws TypeError (nullish)
toNumber('abc') // throws TypeError (invalid)
toNumberOrNil() // undefined
toNumberOrNil('abc') // throws TypeError

toString(123) // '123'
toString() // throws TypeError (nullish)
toStringOrNil() // undefined

toBigInt(0) // 0n
toBigInt('0') // 0n
toBigInt() // throws TypeError (nullish)
toBigInt('foobar') // throws SyntaxError
toBigInt(1.234) // throws RangeError
toBigIntOrNil() // undefined

toDate(1234) // new Date(1234)
toDate('2020-01-01') // new Date('2020-01-01')
toDate() // throws TypeError (no longer returns "now")
toDate('garbage') // throws TypeError (invalid)
toDateOrNil() // undefined
toDateOrNil('garbage') // throws TypeError
```

## Duration

A length of time, accepted by `sleep()`, `fetch()` (`timeout`) and
`TimeoutAbortController` (`timeout`). A `number` is **milliseconds** and may be
fractional; a string carries an explicit unit suffix: `ms` (milliseconds) or `s`
(seconds).

```typescript
import { toMs, type Duration } from '@potentia/util'
// or import { toMs } from '@potentia/util/duration'

const a: Duration = 100 // 100 ms (a number is milliseconds)
const b: Duration = '100ms' // 100 ms
const c: Duration = '5s' // 5 s
const d: Duration = '1.5s' // 1500 ms (fractions allowed)

toMs(100) // 100
toMs('5s') // 5000
toMs('5') // throws RangeError (missing unit)
```

## Patches

Some global prototypes can be patched for nicer ergonomics, but since that
mutates classes shared across your whole process, the patches are **opt-in** and
never applied by importing the package itself.

Each patch is an independent global mutation, so they are exposed at the finest
grain — one type × one concern — and the broader entry points just compose them.
Import exactly what you need, once, at startup:

```typescript
import '@potentia/util/patch' // everything
import '@potentia/util/patch/bigint' // every bigint patch
import '@potentia/util/patch/bigint/json' // just the one you want
```

The tree:

| entry point                     | patches                                  |
| ------------------------------- | ---------------------------------------- |
| `@potentia/util/patch`          | everything below                         |
| `…/patch/bigint`                | `bigint/json`                            |
| `…/patch/bigint/json`           | `BigInt` toJSON → a decimal string       |

What the `bigint/json` patch does — by default `JSON.stringify` throws on a
`bigint`; the patch installs `BigInt.prototype.toJSON` so bigints serialize as
decimal strings:

```typescript
import '@potentia/util/patch/bigint/json'

JSON.stringify({ a: 123n }) // '{"a":"123"}'
```

## Matchers

Custom matchers for `Nil`, `bigint`, `Date` and timestamps, available for jest,
bun:test and vitest. The implementation is shared; only the import path differs.

Each matcher checks the **type** when called with no argument, or the type
**and value** when given one (the expected value is converted automatically).
`toBe*` and `toEqual*` are the same matcher under two names — use `toBe*`
throughout, or follow the jest convention (`toBe*` for the type, `toEqual*` for
equality).

```typescript
// jest:   import * as matchers from '@potentia/util/matcher/jest'
// bun:    import * as matchers from '@potentia/util/matcher/bun'
// vitest: import * as matchers from '@potentia/util/matcher/vitest'
expect.extend(matchers)

expect(undefined).toBeNil()
expect(null).not.toBeNil()

expect(0n).toBeBigInt() // type
expect(0n).toBeBigInt(0) // type and value
expect(0n).toEqualBigInt('0') // same, jest-style

const a = new Date()
expect(a).toBeDate() // type
expect(a).toBeDate(a.getTime()) // type and value
expect(a).toEqualDate(a.toISOString())

expect(a.getTime()).toBeTimestamp()
expect(a.getTime()).toEqualTimestamp(a)
expect(a.getTime()).toBeValidTimestamp()

expect('2020-01-01').toBeDateString() // a date or date-time string
expect('2020-01-01T12:30:00Z').toBeDateString()
```

## Fetch

A drop-in [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
wrapper adding a `timeout` (a [Duration](#duration)) and URL-credential support.
Importing it as `fetch` shadows the global; alias it if you want to keep the
native one (e.g. `import { fetch as request } from '@potentia/util'`).

```typescript
import { fetch } from '@potentia/util'
// or import { fetch } from '@potentia/util/fetch'

const link = 'https://...'
await fetch(link, { ... })                  // identical to the native fetch(link, { ... })
await fetch(link, { timeout: 30000 })       // timeout as a number (30000 ms)
await fetch(link, { timeout: '30s' })       // timeout as a Duration string
await fetch('https://user:pass@host/path')  // URL credentials -> Basic auth header
```

A caller `signal` is combined with the timeout rather than overwritten, and
existing `headers` are preserved when the Authorization header is injected.

## Signature

`sign`/`verify` over an algorithm-tagged key — a discriminated union, so one
pair handles every backend (HMAC, ed25519, RSA) by data. They are **async** and
work on **raw bytes**: a `string` payload is its UTF-8 bytes, the `key` is always
a `Uint8Array`, and the signature is returned as a raw `Uint8Array` — encode it
(base64url, hex, …) at the boundary.

```typescript
import { sign, verify, type Credential } from '@potentia/util'
// or import { sign, verify } from '@potentia/util/signature'

// HMAC (symmetric): `key` is the shared secret bytes
const cred: Credential = {
  algorithm: 'hmac',
  hash: 'sha256',
  key: new TextEncoder().encode('secret'),
}
const signature = await sign(cred, 'message') // Uint8Array
const header = Buffer.from(signature).toString('base64url') // encode for the wire
await verify(cred, 'message', Buffer.from(header, 'base64url')) // true

// ed25519 / rsa (asymmetric): `key` is the DER-encoded key — PKCS#8 private when
// signing, SPKI public when verifying. Convert PEM -> DER in your own layer.
const sig = await sign({ algorithm: 'ed25519', key: privateKeyDer }, 'message')
await verify({ algorithm: 'ed25519', key: publicKeyDer }, 'message', sig)
await sign(
  { algorithm: 'rsa', hash: 'sha256', padding: 'pss', key: privateKeyDer },
  'message',
)
```

The `Credential` variants (`key` is always a `Uint8Array`):

- `{ algorithm: 'hmac', hash?, key }` — `hash` is `'sha256'`/`'sha384'`/`'sha512'` (default `'sha512'`); `key` is the secret bytes
- `{ algorithm: 'ed25519', key }` — `key` is PKCS#8 (private) / SPKI (public) DER
- `{ algorithm: 'rsa', hash?, padding?, key }` — `padding` is `'pkcs1'` (default) or `'pss'`; `key` is PKCS#8 / SPKI DER

An unsupported `algorithm` throws.

## Error

Predefined HTTP 4xx/5xx error classes with a custom `errno` property and
utilities.

```typescript
import assert from 'node:assert'
import {
  HTTPError,
  ClientError,
  NotFoundError,
  createHTTPError,
  rethrow,
  suppress,
  getMessage,
} from '@potentia/util'
// or import { ... } from '@potentia/util/error'

/*
Error
  HTTPError (base class for ClientError and ServerError)
    ClientError (base class for HTTP 4xx errors)
      BadRequestError (400)
      NotFoundError (404)
      ...
    ServerError (base class for HTTP 5xx errors)
      InternalServerError (500)
      ...
*/

const e0 = new NotFoundError()
assert(e0 instanceof NotFoundError)
assert(e0 instanceof ClientError)
assert(e0 instanceof HTTPError)
assert(e0.status === 404)
assert(e0.message === 'Not Found')

// errno defaults to number; any type is supported and can be set explicitly
const e1 = new NotFoundError('foobar', 123)
const e2 = new NotFoundError<boolean>('foobar', true)

// create an error from a status code
createHTTPError(404, 'foobar', 3) // new NotFoundError('foobar', 3)

// rethrow: map one error type to another
class A extends Error {}
class B extends Error {}
class C extends Error {}
Promise.reject(new C()).catch(rethrow(A, B)) // rejects with C
Promise.reject(new A()).catch(rethrow(A, B)) // rejects with B instead

// suppress: swallow a specific error type, optionally with a fallback value
Promise.reject(new A()).catch(suppress(B, 'foobar')) // rejects with A
Promise.reject(new B()).catch(suppress(B, 'foobar')) // resolves with 'foobar'
Promise.reject(new B()).catch(suppress(B)) // resolves with undefined

// get message
getMessage(new Error('foo')) // 'foo'
getMessage({ message: 'bar' }) // 'bar'
```

The utilities:

- `createHTTPError(status, message?, errno?)` — the matching error instance for
  a status code (falls back to `InternalServerError` for an unknown status).
- `rethrow(From, To)` — a `.catch` handler that re-throws `From` errors as `To`
  and passes any other error through unchanged.
- `suppress(Type, value?)` — a `.catch` handler that swallows `Type` errors
  (resolving with `value`, default `undefined`) and re-throws the rest.
- `getMessage(error)` — pull a string message out of any thrown value.

## Promise

`PromiseTracker` wraps a promise and reports whether it has settled (resolved or
rejected) through `isSettled`, without you having to await it; the original
promise stays available as `.promise`.

```typescript
import { PromiseTracker } from '@potentia/util'

const tracker = new PromiseTracker(promise)

// check whether the promise has settled before awaiting it.
// Note: wait a tick first, due to how promise callbacks are scheduled.
await setImmediate()
if (tracker.isSettled) {
  await tracker.promise
}
```

## Abort-Controller

`TimeoutAbortController` is an `AbortController` that also aborts after a
`timeout` (a [Duration](#duration)), optionally chained to an upstream `signal`.
Pass its `.signal` to `fetch`, streams, or anything that accepts an
`AbortSignal`. Its timeout uses an unref'd timer, so a pending controller never
keeps the process alive.

```typescript
import { TimeoutAbortController } from '@potentia/util'

const p = new AbortController()
const c = new TimeoutAbortController({
  signal: p.signal, // optional
  timeout: '5s', // a Duration (5000 or '5s' or '5000ms')
})

/*
c.signal is aborted if
  1. signal is aborted (if provided), or
  2. the timeout (5 s) elapses, or
  3. c.abort() is called.
*/
```

## Logger

`createLogger` is a small leveled logger (`trace` < `debug` < `info` < `warn` <
`error` < `fatal`). It writes to a built-in console sink — `prettyFormat` on a
TTY, compact JSON when piped, with `warn` and above to stderr — and fans
out to any extra **sinks** you pass.

```typescript
import { createLogger } from '@potentia/util/logger'

const log = createLogger({ name: 'api', level: 'info' })

log.info('listening', { port: 3000 })
log.error('request failed', { route: '/orders', status: 500 })

const child = log.child({ requestId: 'abc' }) // bindings merged into every record
child.warn('slow query', { ms: 1240 })

await log.flush() // drain pending sink deliveries
await log.close() // flush, then close sinks (for shutdown)
```

Each call is `level(message, fields?)`. A record is
`{ level, time: Date, name, message, fields? }` — sinks receive the raw record
and format it themselves. Use `format: jsonFormat`/`prettyFormat` (both exported)
to force a console format, or `console: false` to drop the console sink. A
**sink** is a log destination:

```typescript
interface Sink {
  level?: Level // minimum level (defaults to the logger's)
  handle(record: LogRecord): void // called per record; must not throw
  flush?(): Promise<void> // drain pending deliveries
  close?(): Promise<void> // release resources, e.g. close a socket
}
```

### Alert recipes (Google Chat, Slack)

Alert sinks aren't shipped — they're a few lines you copy and adapt, so you own
the format and keep zero dependencies. Each wires a [Dispatcher](#dispatcher)
(batching, retries, graceful flush) to a webhook `POST` via [fetch](#fetch),
throwing on a non-2xx response so the dispatcher retries:

```typescript
import { createDispatcher } from '@potentia/util/dispatcher'
import { fetch } from '@potentia/util/fetch'
import {
  createLogger,
  prettyFormat,
  type Level,
  type LogRecord,
  type Sink,
} from '@potentia/util/logger'

// Google Chat incoming webhook
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

const log = createLogger({
  name: 'api',
  sinks: [gchatSink({ url: GCHAT_WEBHOOK_URL, level: 'error' })],
})
```

A Slack incoming webhook is the same shape with a different body:

```typescript
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
```

## Dispatcher

`createDispatcher` is a transport-agnostic outbound queue for fire-and-forget
work — webhooks, alerts, metrics. You push items; it hands them to your async
`send(items)` callback in **batches**, with debounce, rate-limiting,
retry/backoff, a bounded queue and graceful flush. It knows nothing about HTTP or
logging: the transport — and any connection state — lives in `send`, so the same
primitive drives connectionless and connection-oriented (e.g. WebSocket) sinks.

```typescript
import { createDispatcher } from '@potentia/util/dispatcher'

const dispatcher = createDispatcher<string>(
  async (lines) => {
    await deliver(lines) // your transport; throw to trigger a retry
  },
  {
    maxBatch: 20, // up to 20 items per send()
    maxWait: '2s', // ...but never wait longer than 2 s to send a partial batch
    minInterval: '200ms', // rate-limit: minimum spacing between sends
    retries: 3, // retry a failed send up to 3 times
    backoff: (attempt) => `${attempt}s`, // delay before each retry
    maxQueue: 1000, // bound the buffer; drop oldest beyond this
    onError: (err, items) => console.error('dropped', items.length, err),
  },
)

dispatcher.push('hello') // fire-and-forget: never blocks, never throws
await dispatcher.flush() // resolve once the queue has drained
await dispatcher.close() // flush, then stop accepting new items
```

`send` always receives an array (length 1 when not batching), and a failed
`send` is retried up to `retries` times — gate it with `shouldRetry(error)` to
keep transport-specific policy in your callback. The bounded `maxQueue` (default
1000, drop-oldest) is the backpressure valve that keeps a slow or unreachable
destination from leaking memory under a storm.

## Misc

The sleep helpers are promise-based delays: `sleep` takes a
[Duration](#duration), while `msleep` and `ssleep` are explicit millisecond and
second variants. All accept an optional `AbortSignal` and reject with
`RangeError` on an out-of-range delay.

`option(key, value)` returns `{ [key]: value }`, or `undefined` when `value` is
nullish — handy for conditionally spreading a property into an object.

```typescript
import { option, sleep, msleep, ssleep } from '@potentia/util'

await sleep(123) // 123 ms (a number is milliseconds)
await sleep('123ms') // same, as a Duration string
await sleep('5s') // 5 seconds
await msleep(123) // 123 ms (explicit)
await ssleep(0.123) // 0.123 seconds (explicit)
await sleep(123, { signal }) // cancellable via an AbortSignal
sleep(NaN) // rejects with RangeError (invalid delay)

option('foo', 'bar') // => { foo: 'bar' }
option('foo', null) // => undefined
option('foo', undefined) // => undefined
// used to assign a key/value to an object conditionally:
const a = { a: 123, b: 'foobar', c: true, d: null, e: undefined }
const obj = {
  ...option('a', a.a),
  ...option('b', a.b),
  ...option('c', a.c),
  ...option('d', a.d),
  ...option('e', a.e),
} // { a: 123, b: 'foobar', c: true }
```
