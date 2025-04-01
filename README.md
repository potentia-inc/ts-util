# @potentia/util

A collection of utilities to make life easier

 - [types](#types): utilities for `undefined`, `BigInt` and `Date`
 - [jest matchers](#jest-matchers): [jest](https://jestjs.io) matchers for
  `undefined`, `BigInt` and `Date`
 - [request](#request):
   [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) wrapper
   with timeout support
 - [signature](#signature): utilities to sign the content and verify the
   signature digests
 - [error](#error): predefiend HTTP error classes and utilities
 - [misc](#misc): other utilities

## Types

Aliases for `undefined` as `Nil` to shorten code and improve naming consistency

```typescript
import { Nil, TypeOrNil } from '@potentia/util'
// or import { Nil, ... } from '@potentia/util/type'

assert(Nil === undefined) // Nil is the value alias of undefined
function returnNil(): Nil { // Nil is also the type alias of undefined
  return Nil // the same as return undefined
}
```

Type utilities

```typescript
import {
  TypeOrNil,
  PickRequired,
  PickPartial,
  MixRequiredPartial,
} from '@potentia/util'
// or import { TypeOrNil, ... } from '@potentia/util/type'

// type utility to create T | undefined type from T
type FooOrNil = TypeOfNil<Foo> // the same as Foo | Nil or Foo | undefined

// pre-defined types:
const a: BigIntOrNil = 0n // bigint | undefined
const b: DateOrNil = Nil // Date | undefined
const c: NumberOrNil = 0 // number | undefined
const d: StringOrNil = '' //  string | undefined
const e: BufferOrNil = Nil // Buffer | undefined
const f: NumStr = '123.456'
const g: NumStrOrNil = Nil // NumStr | undefined

// type utility to fine-tune the object field
type A = {
  a: string
  b: number
  c?: Date
  d?: boolean
  e?: Buffer
}

// A['c'] and A['d'] are required now
const a1 = PickRequired<A, 'c' | 'd'> = { a: 'foo', b: 123, c: new Date(), d: false }

// A['a'] is optional now
const a2 = PickPartial<A, 'a'> = { b: 123 }

// A['c'] and A['d'] are required and A['a'] is optional now
const a3 = MixRequiredPartial<A, 'c' | 'd', 'a'> = { b: 123, c: new Date(), d: false }}
```

Utilities for `number`, `string`, `bigint`, `Date` conversion

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

toNumber(0) // alias of Number(0)
toNumber('0') // alias of Number('0')
toNumberOrNil() // undefined

toString(0) // alias of String(0)
toString('0') // alias of String('0')
toStringOrNil() // undefined

toBigInt(0) // 0n
toBigInt('0') // 0n
toBigInt() // throw SyntaxError
toBigInt(1.234) // throw RangeSyntax
toBigIntOrNil() // undefined

toDate() // equals to new Date()
toDate(1234) // equals to new Date(1234)
toDate('foobar') // equals to new Date('foobar'), get an invalid date
toDateOrNil() // undefined
```

## Jest matchers

[jest](https://jestjs.io) matchers for `BigInt`, `Date` and timestamp

```typescript
import * as matchers from '@potentia/util/jest'
expect.extend(matchers)

/*
name convention:

 toBe???(): check the type
 example:
  expect(x).toBeBigInt()
  check that x is of type BigInt

 toEqual???(): check the type and the value equality
 example:
  expect(x).toEqualBigInt(y)
  check that x is of type BigInt and equals to y,
  where y is converted to BigInt automatically)
*/

expect(0n).toBeBigInt()
expect(0).not.toBeBigInt()
expect(0n).toEqualBigInt(0n)
expect(0n).toEqualBigInt(0)
expect(0n).toEqualBigInt('0')
expect(0n).not.toEqualBigInt(1)
expect(0).not.toEqualBigInt(0)

expect(new Date()).not.toEqualDate(new Date())
const a = new Date()
expect(a).toEqualDate(a)
expect(a).toEqualDate(a.getTime())
expect(a).toEqualDate(a.toISOString())

expect(a.getTime()).toBeTimestamp()
expect('foobar').not.toBeTimestamp()
expect(a.getTime()).toEqualTimestamp(a)
expect(a.getTime()).toEqualTimestamp(a.getTime())
expect(a.getTime()).toEqualTimestamp(a.toISOString())
```

Note: use [jest-extended](https://www.npmjs.com/package/jest-extended)
for `.toBeDate()` and `.toBeDateString()`

## Request

[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) wrapper
with timeout support

```typescript
import { request } from '@potentia/util'
// or import { request } from '@potentia/util/request'

const link = 'https://...'
const res = await request(link, { ... }) // identical to fetch(link, { ... })
const res = await request(link, { timeout: 30000 }) // fetch() with 30 seconds timeout
const res = await request('https://user:pass@host/path') // url with credentials is supported as well
```

## Signature

Utility to sign the content and verify the signature digests for the given
algorithm and key

```typescript
import { sign, verify } from '@potentia/util'
// or import { sign, verify } from '@potentia/util/signature'

/*
sign content with specified algorithm/key and return the digest as a Buffer
 algorithm: md5
 key: 'key'
 content: 'The quick brown fox jumps over the lazy dog'
*/
const digest = sign('md5', 'key', 'The quick brown fox jumps over the lazy dog')
verify(digest, Buffer.from('80070713463e7749b90c2dc24911e275', 'hex')) // true
```

## Error

Predefined HTTP 4xx/5xx error classes with a custom errno property support and utilities

```typescript
import assert from 'node:assert'
import {
  HTTPError,
  ClientError,
  NotFoundError,
  createHTTPError,
  rethrow,
  supress,
  getMessage,
} from '@potentia/util'
// or import { ... } from '@potentia/util/error'

/*
all errors with standard HTTP 4xx and 5xx are predefined:

Error
  HTTPError (base class for ClientError and ServerError)
    ClientError (base class for HTTP 4xx errors)
      BadRequestError (400)
      UnauthorizedError (401)
      PaymentRequiredError (402)
      ForbiddenError (403)
      NotFoundError (404)
      ...
    ServerError (base class for HTTP 5xx errors)
      InternalServerError (500)
      NotImplementedError (501)
      ...
*/

const e0 = new NotFoundError()
assert(e0 instanceof NotFoundError)
assert(e0 instanceof ClientError)
assert(e0 instanceof HTTPError)
assert(e0 instanceof Error)
assert(e0.status === 404)
assert(e0.message === 'Not Found')
assert(e0.errno === undefined)

// errno property default to number type
const e1 = new NotFoundError('foobar', 123)
assert(e1.status === 404)
assert(e1.message === 'foobar')
assert(e1.errno === 123)

// other type is also supported
const e2 = new NotFoundError('foobar', '123')
assert(e2.errno === '123')

// the errno type can be specified explicitly
const e3 = new NotFoundError<boolean>('foobar', true)
assert(e3.errno === true)

// create an error from status
createHTTPError(404, 'foobar', 3) // new NotFoundError('foobar', 3)

// other utilities
class A extends Error {}
class B extends Error {}
class C extends Error {}

// rethrow error
Promise.reject(new C()).catch(rethrow(A, B)) // rejects with C error
Promise.reject(new A()).catch(rethrow(A, B)) // rejects with B error instead

// supress error
Promise.reject(new A()).catch(supress(B, 'foobar')) // rejects with A error
Promise.reject(new B()).catch(supress(B, 'foobar')) // resolve with 'foobar'
Promise.reject(new B()).catch(supress(B)) // resolve with undefined
Promise.reject(new B()).catch(supress<string>(B)) // return type specified explicitly
Promise.reject(new B()).catch(supress<string, B>(B)) // types specified explicitly

// get message
getMessage(new Error('foo')) // get 'foo'
getMessage({ message: 'bar' }) // get 'bar'
```

## Misc

```typescript
import { option, sleep, ssleep, msleep } from '@potentia/util'

await ssleep(0.123) // sleep 0.123 second
await msleep(123) // sleep 123 milliseconds
await sleep(123) // the same as msleep(123) for backward compatibility

option('foo', bar) // => { 'foo': 'bar' }
option('foo', 123.345) // => { 'foo': 123.456 }
option('foo', null) // => undefined
option('foo', undefined) // => undefined
// used to assign the key/value in an object optionally
const a = { a: 123, b: 'foobar', c: true, d: null, e: undefined }
const obj = {
  ...option('a', a.a),
  ...option('b', a.b),
  ...option('c', a.c),
  ...option('d', a.d),
  ...option('e', a.e),
} // b is { a: 123, b: 'foobar', c: true }
```
