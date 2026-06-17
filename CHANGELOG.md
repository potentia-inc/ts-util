# Change log

## [4.3.0] - 2026-06-17

- `toBigInt()` and `toNumber()` now accept numeric wrapper objects (e.g.
  `BigNumber`, `Decimal128`, boxed `Number`) by converting them via their string
  form
- `toBigInt()` additionally parses integral decimal and exponent strings
  (`'12.00'`, `'1E3'`, `'1.2300E2'`) losslessly, on top of the
  integer/hex/octal/binary forms `BigInt` already accepts; a non-integer value
  (e.g. `'1.5'`) still throws
- Behavior change: `toBigInt()`/`toNumber()` now throw on empty/whitespace-only
  strings and on arrays instead of silently returning `0n`/`0` (e.g.
  `toBigInt('')`, `toNumber([])`) or coercing a single element (`toNumber([5])`).
  The `...OrNil` variants are unchanged (nullish -> Nil, otherwise delegate)

## [4.2.0] - 2026-06-10

- Move the `bigint` JSON patch under a `@potentia/util/patch` tree
  (`@potentia/util/patch/bigint/json`, with `.../patch/bigint` and `.../patch`
  composing it), mirroring `@potentia/mongodb7` so further patches can be added
  at the finest grain. The original `@potentia/util/bigint-json` import keeps
  working

## [4.1.0] - 2026-06-09

- Add `@potentia/util/logger`: a leveled logger (`trace`..`fatal`) with a
  built-in console sink (`prettyFormat` on a TTY, JSON otherwise; `warn`+ to
  stderr), child-logger bindings, and a pluggable `Sink` contract. Records are
  `{ level, time: Date, name, message, fields? }`
- Add `@potentia/util/dispatcher`: a transport-agnostic, fire-and-forget
  outbound queue with batching, debounce, rate-limiting, retry/backoff, a
  bounded (drop-oldest) queue, and graceful flush/close
- Document Google Chat and Slack alert sinks as copy-paste recipes (verified as
  test fixtures) rather than shipped code

## [4.0.0] - 2026-06-08

Cross-runtime release (Node.js >= 22, Bun, Deno >= 2); no runtime dependencies.

- Support Bun and Deno; add `bun:test` and `vitest` matchers alongside jest,
  under `/matcher/{jest,bun,vitest}`. Each matcher checks the type with no
  argument or equality with one, exposed under both `toBe*`/`toEqual*` names;
  adds `toBeDate` and `toBeDateString`
- Add a `Duration` type and `toMs()`; `sleep()`, `fetch()` and
  `TimeoutAbortController` take a `Duration` (a number is ms, or `'5s'`/`'100ms'`;
  `TimeoutAbortController` was previously seconds)
- Rename `request()` to `fetch()` (a superset of the native `fetch`); the
  subpath is now `@potentia/util/fetch`
- Rework `sign`/`verify`: now async, dispatch on a `Credential` -- a
  discriminated union (`{ algorithm: 'hmac', hash?, key }`,
  `{ algorithm: 'ed25519', key }`, `{ algorithm: 'rsa', hash?, padding?, key }`).
  `key` is always raw bytes (`Uint8Array`): the HMAC secret, or DER-encoded
  asymmetric keys (PKCS#8 private / SPKI public) -- PEM is the caller's concern.
  Returns the raw signature as a `Uint8Array`. HMAC, ed25519 and RSA supported
- Rename `supress` to `suppress`
- Strict `toX()` coercions throw on nullish/invalid (`toDate()` no longer returns
  "now"); `toXOrNil()` returns `Nil` for nullish but still throws on invalid
- `BigInt` JSON serialization is now opt-in via `@potentia/util/bigint-json`
- Remove `NIL` (use `Nil`), `BufferOrNil` (use `Uint8ArrayOrNil`), and `msleep`'s
  boolean return; `sleep` validates its delay and accepts an `AbortSignal`
- Fix `PromiseTracker` unhandled rejection; `request()` signal/`Headers`/
  credential handling; `TimeoutAbortController` timer leak
- Fix the `exports` map; enable `isolatedModules`/`verbatimModuleSyntax`

## [3.5.0] - 2025-11-17

- Support node@^24.0.0
- Use node:test instead of jest

## [3.4.1] - 2025-07-09

- Export the new symbols

## [3.4.0] - 2025-07-09

- Introduce `PromiseTracker` and `TimeoutAbortController`

## [3.3.0] - 2025-04-01

- Introduce `ssleep()` and `msleep()`

## [3.2.0] - 2025-03-13

- Add `getMessage()` to get error's message

## [3.1.0] - 2025-03-12

- Add more pre-defined types: `NumStr`, `NnmStrOrNil`, `BufferOrNil`
- Add more cast functions: `toNumber()`, `toNumberOrNil()`, `toString()`, `toStringOrNil()`
- Add helper function: `isNullish()`
- Add more type utilities: `PickRequired`, `PickPartial`, `MixRequiredPartial`

## [3.0.0] - 2025-02-03

- Upgrade to node-22

## [2.1.1] - 2024-08-29

- Alias undefined as Nil for both value and type

## [2.1.0] - 2024-08-20

- Introduce undefined alias Nil/NIL and related types/utilities
- Support URL with credentials for request()
  e.g. http://user:pass@host/path

## [2.0.1] - 2024-08-16

Refine the tsconfig.json and upgrade packages

## [2.0.0] - 2024-07-30

Swap the type arguments of supress() and default the E to Error

## [1.0.0] - 2024-03-06

The first release
