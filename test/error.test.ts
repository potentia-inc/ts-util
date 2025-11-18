import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import {
  HTTPError,
  ClientError,
  ServerError,
  BadGatewayError,
  BadRequestError,
  BandwidthLimitExceededError,
  ConflictError,
  ExpectationFailedError,
  FailedDependencyError,
  ForbiddenError,
  GatewayTimeoutError,
  GoneError,
  HTTPVersionNotSupportedError,
  ImaTeapotError,
  InsufficientStorageError,
  InternalServerError,
  LengthRequiredError,
  LockedError,
  LoopDetectedError,
  MethodNotAllowedError,
  MisdirectedRequestError,
  NetworkAuthenticationRequiredError,
  NotAcceptableError,
  NotExtendedError,
  NotFoundError,
  NotImplementedError,
  PayloadTooLargeError,
  PaymentRequiredError,
  PreconditionFailedError,
  PreconditionRequiredError,
  ProxyAuthenticationRequiredError,
  RangeNotSatisfiableError,
  RequestHeaderFieldsTooLargeError,
  RequestTimeoutError,
  ServiceUnavailableError,
  TooEarlyError,
  TooManyRequestsError,
  UnauthorizedError,
  UnavailableForLegalReasonsError,
  UnprocessableEntityError,
  UnsupportedMediaTypeError,
  UpgradeRequiredError,
  URITooLongError,
  VariantAlsoNegotiatesError,
  createHTTPError,
  getMessage,
  rethrow,
  supress,
} from '../src/error.js'

describe('http error', () => {
  test('createHTTPError()', () => {
    assert.throws(fn(400), BadRequestError)
    assert.throws(fn(401), UnauthorizedError)
    assert.throws(fn(402), PaymentRequiredError)
    assert.throws(fn(403), ForbiddenError)
    assert.throws(fn(404), NotFoundError)
    assert.throws(fn(405), MethodNotAllowedError)
    assert.throws(fn(406), NotAcceptableError)
    assert.throws(fn(407), ProxyAuthenticationRequiredError)
    assert.throws(fn(408), RequestTimeoutError)
    assert.throws(fn(409), ConflictError)
    assert.throws(fn(410), GoneError)
    assert.throws(fn(411), LengthRequiredError)
    assert.throws(fn(412), PreconditionFailedError)
    assert.throws(fn(413), PayloadTooLargeError)
    assert.throws(fn(414), URITooLongError)
    assert.throws(fn(415), UnsupportedMediaTypeError)
    assert.throws(fn(416), RangeNotSatisfiableError)
    assert.throws(fn(417), ExpectationFailedError)
    assert.throws(fn(418), ImaTeapotError)
    assert.throws(fn(421), MisdirectedRequestError)
    assert.throws(fn(422), UnprocessableEntityError)
    assert.throws(fn(423), LockedError)
    assert.throws(fn(424), FailedDependencyError)
    assert.throws(fn(425), TooEarlyError)
    assert.throws(fn(426), UpgradeRequiredError)
    assert.throws(fn(428), PreconditionRequiredError)
    assert.throws(fn(429), TooManyRequestsError)
    assert.throws(fn(431), RequestHeaderFieldsTooLargeError)
    assert.throws(fn(451), UnavailableForLegalReasonsError)
    assert.throws(fn(500), InternalServerError)
    assert.throws(fn(501), NotImplementedError)
    assert.throws(fn(502), BadGatewayError)
    assert.throws(fn(503), ServiceUnavailableError)
    assert.throws(fn(504), GatewayTimeoutError)
    assert.throws(fn(505), HTTPVersionNotSupportedError)
    assert.throws(fn(506), VariantAlsoNegotiatesError)
    assert.throws(fn(507), InsufficientStorageError)
    assert.throws(fn(508), LoopDetectedError)
    assert.throws(fn(509), BandwidthLimitExceededError)
    assert.throws(fn(510), NotExtendedError)
    assert.throws(fn(511), NetworkAuthenticationRequiredError)
    assert.throws(fn(999), InternalServerError)

    function fn(status: number): () => never {
      return () => {
        throw createHTTPError(status)
      }
    }
  })

  test('HTTPError()', () => {
    const message = 'foobar'
    const errno = 123
    const status = 456
    const err = new HTTPError(message, errno, status)
    assert.equal(err.name, 'HTTPError')
    assert(err instanceof HTTPError)
    assert.equal(err.message, message)
    assert.equal(err.status, status)
    assert.equal(err.errno, errno)

    assert.equal(new HTTPError().message, 'HTTP Error')
    assert.equal(new HTTPError().errno, undefined)
    assert.equal(new HTTPError().status, 500)
  })

  test('HTTPError<string>()', () => {
    const message = 'foo'
    const errno = 'bar'
    const status = 456
    const err = new HTTPError(message, errno, status)
    assert.equal(err.name, 'HTTPError')
    assert(err instanceof HTTPError)
    assert.equal(err.message, message)
    assert.equal(err.status, status)
    assert.equal(err.errno, errno)
  })

  test('ClientError()', () => {
    const message = 'foobar'
    const errno = 123
    const status = 456
    const err = new ClientError(message, errno, status)
    assert(err instanceof HTTPError)
    assert(err instanceof ClientError)
    assert.equal(err.name, 'ClientError')
    assert.equal(err.message, message)
    assert.equal(err.status, status)
    assert.equal(err.errno, errno)

    assert.equal(new ClientError().message, 'Client Error')
    assert.equal(new ClientError().errno, undefined)
    assert.equal(new ClientError().status, 400)

    assert.throws(() => new ClientError(message, errno, 500))
  })

  test('ServerError()', () => {
    const message = 'foobar'
    const errno = 123
    const status = 567
    const err = new ServerError(message, errno, status)
    assert(err instanceof HTTPError)
    assert(err instanceof ServerError)
    assert.equal(err.name, 'ServerError')
    assert.equal(err.message, message)
    assert.equal(err.status, status)
    assert.equal(err.errno, errno)

    assert.equal(new ServerError().message, 'Server Error')
    assert.equal(new ServerError().errno, undefined)
    assert.equal(new ServerError().status, 500)

    assert.throws(() => new ServerError(message, errno, 400))
  })
})

describe('error utilities', () => {
  test('rethrow()', async () => {
    class SrcError extends Error {}
    class DstError extends Error {}
    await assert.rejects(
      reject(Error).catch(rethrow(SrcError, DstError)),
      Error,
    )
    await assert.rejects(
      reject(SrcError).catch(rethrow(SrcError, DstError)),
      DstError,
    )
  })

  test('supress()', async () => {
    class OmitError extends Error {}
    await assert.rejects(reject(Error).catch(supress(OmitError)), Error)
    await assert.rejects(
      reject(Error).catch(supress(OmitError, 'foobar')),
      Error,
    )
    assert.equal(await reject(OmitError).catch(supress(OmitError)), undefined)
    assert.equal(
      await reject(OmitError).catch(supress<string>(OmitError)),
      undefined,
    )
    assert.equal(
      await reject(OmitError).catch(supress(OmitError, 'foobar')),
      'foobar',
    )
    assert.equal(
      await resolve('foobar').catch(supress<string, OmitError>(OmitError)),
      'foobar',
    )
  })

  test('getMessage', () => {
    assert.equal(getMessage(new Error('foobar')), 'foobar')
    assert.equal(getMessage({ message: 'foobar' }), 'foobar')
    assert.equal(getMessage('foobar'), 'foobar')
    assert.equal(typeof getMessage({ foo: 'bar' }), 'string')
  })

  function resolve(x: string): Promise<string> {
    return Promise.resolve(x)
  }

  function reject<E>(Err: new (message?: string) => E): Promise<never> {
    return Promise.reject(new Err())
  }
})
