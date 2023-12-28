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
  rethrow,
  supress,
} from '../src/error.js'

describe('http error', () => {
  test('createHTTPError()', () => {
    expect(fn(400)).toThrow(BadRequestError)
    expect(fn(401)).toThrow(UnauthorizedError)
    expect(fn(402)).toThrow(PaymentRequiredError)
    expect(fn(403)).toThrow(ForbiddenError)
    expect(fn(404)).toThrow(NotFoundError)
    expect(fn(405)).toThrow(MethodNotAllowedError)
    expect(fn(406)).toThrow(NotAcceptableError)
    expect(fn(407)).toThrow(ProxyAuthenticationRequiredError)
    expect(fn(408)).toThrow(RequestTimeoutError)
    expect(fn(409)).toThrow(ConflictError)
    expect(fn(410)).toThrow(GoneError)
    expect(fn(411)).toThrow(LengthRequiredError)
    expect(fn(412)).toThrow(PreconditionFailedError)
    expect(fn(413)).toThrow(PayloadTooLargeError)
    expect(fn(414)).toThrow(URITooLongError)
    expect(fn(415)).toThrow(UnsupportedMediaTypeError)
    expect(fn(416)).toThrow(RangeNotSatisfiableError)
    expect(fn(417)).toThrow(ExpectationFailedError)
    expect(fn(418)).toThrow(ImaTeapotError)
    expect(fn(421)).toThrow(MisdirectedRequestError)
    expect(fn(422)).toThrow(UnprocessableEntityError)
    expect(fn(423)).toThrow(LockedError)
    expect(fn(424)).toThrow(FailedDependencyError)
    expect(fn(425)).toThrow(TooEarlyError)
    expect(fn(426)).toThrow(UpgradeRequiredError)
    expect(fn(428)).toThrow(PreconditionRequiredError)
    expect(fn(429)).toThrow(TooManyRequestsError)
    expect(fn(431)).toThrow(RequestHeaderFieldsTooLargeError)
    expect(fn(451)).toThrow(UnavailableForLegalReasonsError)
    expect(fn(500)).toThrow(InternalServerError)
    expect(fn(501)).toThrow(NotImplementedError)
    expect(fn(502)).toThrow(BadGatewayError)
    expect(fn(503)).toThrow(ServiceUnavailableError)
    expect(fn(504)).toThrow(GatewayTimeoutError)
    expect(fn(505)).toThrow(HTTPVersionNotSupportedError)
    expect(fn(506)).toThrow(VariantAlsoNegotiatesError)
    expect(fn(507)).toThrow(InsufficientStorageError)
    expect(fn(508)).toThrow(LoopDetectedError)
    expect(fn(509)).toThrow(BandwidthLimitExceededError)
    expect(fn(510)).toThrow(NotExtendedError)
    expect(fn(511)).toThrow(NetworkAuthenticationRequiredError)
    expect(fn(999)).toThrow(InternalServerError)

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
    expect(err.name).toBe('HTTPError')
    expect(err).toBeInstanceOf(HTTPError)
    expect(err.message).toBe(message)
    expect(err.status).toBe(status)
    expect(err.errno).toBe(errno)

    expect(new HTTPError().message).toBe('HTTP Error')
    expect(new HTTPError().errno).toBeUndefined()
    expect(new HTTPError().status).toBe(500)
  })

  test('HTTPError<string>()', () => {
    const message = 'foo'
    const errno = 'bar'
    const status = 456
    const err = new HTTPError(message, errno, status)
    expect(err.name).toBe('HTTPError')
    expect(err).toBeInstanceOf(HTTPError)
    expect(err.message).toBe(message)
    expect(err.status).toBe(status)
    expect(err.errno).toBe(errno)
  })

  test('ClientError()', () => {
    const message = 'foobar'
    const errno = 123
    const status = 456
    const err = new ClientError(message, errno, status)
    expect(err).toBeInstanceOf(HTTPError)
    expect(err).toBeInstanceOf(ClientError)
    expect(err.name).toBe('ClientError')
    expect(err.message).toBe(message)
    expect(err.status).toBe(status)
    expect(err.errno).toBe(errno)

    expect(new ClientError().message).toBe('Client Error')
    expect(new ClientError().errno).toBeUndefined()
    expect(new ClientError().status).toBe(400)

    expect(() => new ClientError(message, errno, 500)).toThrow()
  })

  test('ServerError()', () => {
    const message = 'foobar'
    const errno = 123
    const status = 567
    const err = new ServerError(message, errno, status)
    expect(err).toBeInstanceOf(HTTPError)
    expect(err).toBeInstanceOf(ServerError)
    expect(err.name).toBe('ServerError')
    expect(err.message).toBe(message)
    expect(err.status).toBe(status)
    expect(err.errno).toBe(errno)

    expect(new ServerError().message).toBe('Server Error')
    expect(new ServerError().errno).toBeUndefined()
    expect(new ServerError().status).toBe(500)

    expect(() => new ServerError(message, errno, 400)).toThrow()
  })
})

describe('error utilities', () => {
  test('rethrow()', async () => {
    class SrcError extends Error {}
    class DstError extends Error {}
    await expect(fn(Error).catch(rethrow(SrcError, DstError))).rejects.toThrow(
      Error,
    )
    await expect(
      fn(SrcError).catch(rethrow(SrcError, DstError)),
    ).rejects.toThrow(DstError)
  })

  test('supress()', async () => {
    class OmitError extends Error {}
    await expect(fn(Error).catch(supress(OmitError))).rejects.toThrow(Error)
    await expect(fn(Error).catch(supress(OmitError, 'foobar'))).rejects.toThrow(
      Error,
    )
    await expect(
      fn(OmitError).catch(supress(OmitError)),
    ).resolves.toBeUndefined()
    await expect(
      fn(OmitError).catch(supress(OmitError, 'foobar')),
    ).resolves.toBe('foobar')
  })

  function fn<E>(Err: new (message?: string) => E): Promise<never> {
    return Promise.reject(new Err())
  }
})
