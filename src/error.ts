import assert from 'node:assert'

export class HTTPError<T = number> extends Error {
  errno?: T
  status: number

  constructor(message?: string, errno?: T, status?: number) {
    super(message ?? 'HTTP Error')
    this.name = 'HTTPError'
    this.status = status ?? 500
    this.errno = errno
  }
}

export class ClientError<T = number> extends HTTPError<T> {
  constructor(message?: string, errno?: T, status?: number) {
    super(message ?? 'Client Error', errno, status ?? 400)
    assert(this.status >= 400 && this.status < 500)
    this.name = 'ClientError'
  }
}

export class ServerError<T = number> extends HTTPError<T> {
  constructor(message?: string, errno?: T, status?: number) {
    super(message ?? 'Server Error', errno, status ?? 500)
    assert(this.status >= 500 && this.status < 600)
    this.name = 'ServerError'
  }
}

export class BadRequestError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Bad Request', errno, 400)
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Unauthorized', errno, 401)
    this.name = 'UnauthorizedError'
  }
}

export class PaymentRequiredError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Payment Required', errno, 402)
    this.name = 'PaymentRequiredError'
  }
}

export class ForbiddenError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Forbidden', errno, 403)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Not Found', errno, 404)
    this.name = 'NotFoundError'
  }
}

export class MethodNotAllowedError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Method Not Allowed', errno, 405)
    this.name = 'MethodNotAllowedError'
  }
}

export class NotAcceptableError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Not Acceptable', errno, 406)
    this.name = 'NotAcceptableError'
  }
}

export class ProxyAuthenticationRequiredError<
  T = number,
> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Proxy Authentication Required', errno, 407)
    this.name = 'ProxyAuthenticationRequiredError'
  }
}

export class RequestTimeoutError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Request Timeout', errno, 408)
    this.name = 'RequestTimeoutError'
  }
}

export class ConflictError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Conflict', errno, 409)
    this.name = 'ConflictError'
  }
}

export class GoneError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Gone', errno, 410)
    this.name = 'GoneError'
  }
}

export class LengthRequiredError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Length Required', errno, 411)
    this.name = 'LengthRequiredError'
  }
}

export class PreconditionFailedError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Precondition Failed', errno, 412)
    this.name = 'PreconditionFailedError'
  }
}

export class PayloadTooLargeError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Payload Too Large', errno, 413)
    this.name = 'PayloadTooLargeError'
  }
}

export class URITooLongError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'URI Too Long', errno, 414)
    this.name = 'URITooLongError'
  }
}

export class UnsupportedMediaTypeError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Unsupported Media Type', errno, 415)
    this.name = 'UnsupportedMediaTypeError'
  }
}

export class RangeNotSatisfiableError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Range Not Satisfiable', errno, 416)
    this.name = 'RangeNotSatisfiableError'
  }
}

export class ExpectationFailedError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Expectation Failed', errno, 417)
    this.name = 'ExpectationFailedError'
  }
}

export class ImaTeapotError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? "I'm a Teapot", errno, 418)
    this.name = 'ImaTeapotError'
  }
}

export class MisdirectedRequestError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Misdirected Request', errno, 421)
    this.name = 'MisdirectedRequestError'
  }
}

export class UnprocessableEntityError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Unprocessable Entity', errno, 422)
    this.name = 'UnprocessableEntityError'
  }
}

export class LockedError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Locked', errno, 423)
    this.name = 'LockedError'
  }
}

export class FailedDependencyError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Failed Dependency', errno, 424)
    this.name = 'FailedDependencyError'
  }
}

export class TooEarlyError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Too Early', errno, 425)
    this.name = 'TooEarlyError'
  }
}

export class UpgradeRequiredError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Upgrade Required', errno, 426)
    this.name = 'UpgradeRequiredError'
  }
}

export class PreconditionRequiredError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Precondition Required', errno, 428)
    this.name = 'PreconditionRequiredError'
  }
}

export class TooManyRequestsError<T = number> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Too Many Requests', errno, 429)
    this.name = 'TooManyRequestsError'
  }
}

export class RequestHeaderFieldsTooLargeError<
  T = number,
> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Request Header Fields Too Large', errno, 431)
    this.name = 'RequestHeaderFieldsTooLargeError'
  }
}

export class UnavailableForLegalReasonsError<
  T = number,
> extends ClientError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Unavailable For Legal Reasons', errno, 451)
    this.name = 'UnavailableForLegalReasonsError'
  }
}

export class InternalServerError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Internal Server Error', errno, 500)
    this.name = 'InternalServerError'
  }
}

export class NotImplementedError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Not Implemented', errno, 501)
    this.name = 'NotImplementedError'
  }
}

export class BadGatewayError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Bad Gateway', errno, 502)
    this.name = 'BadGatewayError'
  }
}

export class ServiceUnavailableError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Service Unavailable', errno, 503)
    this.name = 'ServiceUnavailableError'
  }
}

export class GatewayTimeoutError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Gateway Timeout', errno, 504)
    this.name = 'GatewayTimeoutError'
  }
}

export class HTTPVersionNotSupportedError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'HTTP Version Not Supported', errno, 505)
    this.name = 'HTTPVersionNotSupportedError'
  }
}

export class VariantAlsoNegotiatesError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Variant Also Negotiates', errno, 506)
    this.name = 'VariantAlsoNegotiatesError'
  }
}

export class InsufficientStorageError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Insufficient Storage', errno, 507)
    this.name = 'InsufficientStorageError'
  }
}

export class LoopDetectedError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Loop Detected', errno, 508)
    this.name = 'LoopDetectedError'
  }
}

export class BandwidthLimitExceededError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Bandwidth Limit Exceeded', errno, 509)
    this.name = 'BandwidthLimitExceededError'
  }
}

export class NotExtendedError<T = number> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Not Extended', errno, 510)
    this.name = 'NotExtendedError'
  }
}

export class NetworkAuthenticationRequiredError<
  T = number,
> extends ServerError<T> {
  constructor(message?: string, errno?: T) {
    super(message ?? 'Network Authentication Required', errno, 511)
    this.name = 'NetworkAuthenticationRequiredError'
  }
}

export function createHTTPError<T = number>(
  status: number,
  message?: string,
  errno?: T,
): HTTPError<T> {
  switch (status) {
    case 400:
      return new BadRequestError<T>(message, errno)
    case 401:
      return new UnauthorizedError<T>(message, errno)
    case 402:
      return new PaymentRequiredError<T>(message, errno)
    case 403:
      return new ForbiddenError<T>(message, errno)
    case 404:
      return new NotFoundError<T>(message, errno)
    case 405:
      return new MethodNotAllowedError<T>(message, errno)
    case 406:
      return new NotAcceptableError<T>(message, errno)
    case 407:
      return new ProxyAuthenticationRequiredError<T>(message, errno)
    case 408:
      return new RequestTimeoutError<T>(message, errno)
    case 409:
      return new ConflictError<T>(message, errno)
    case 410:
      return new GoneError<T>(message, errno)
    case 411:
      return new LengthRequiredError<T>(message, errno)
    case 412:
      return new PreconditionFailedError<T>(message, errno)
    case 413:
      return new PayloadTooLargeError<T>(message, errno)
    case 414:
      return new URITooLongError<T>(message, errno)
    case 415:
      return new UnsupportedMediaTypeError<T>(message, errno)
    case 416:
      return new RangeNotSatisfiableError<T>(message, errno)
    case 417:
      return new ExpectationFailedError<T>(message, errno)
    case 418:
      return new ImaTeapotError<T>(message, errno)
    case 421:
      return new MisdirectedRequestError<T>(message, errno)
    case 422:
      return new UnprocessableEntityError<T>(message, errno)
    case 423:
      return new LockedError<T>(message, errno)
    case 424:
      return new FailedDependencyError<T>(message, errno)
    case 425:
      return new TooEarlyError<T>(message, errno)
    case 426:
      return new UpgradeRequiredError<T>(message, errno)
    case 428:
      return new PreconditionRequiredError<T>(message, errno)
    case 429:
      return new TooManyRequestsError<T>(message, errno)
    case 431:
      return new RequestHeaderFieldsTooLargeError<T>(message, errno)
    case 451:
      return new UnavailableForLegalReasonsError<T>(message, errno)
    case 500:
      return new InternalServerError<T>(message, errno)
    case 501:
      return new NotImplementedError<T>(message, errno)
    case 502:
      return new BadGatewayError<T>(message, errno)
    case 503:
      return new ServiceUnavailableError<T>(message, errno)
    case 504:
      return new GatewayTimeoutError<T>(message, errno)
    case 505:
      return new HTTPVersionNotSupportedError<T>(message, errno)
    case 506:
      return new VariantAlsoNegotiatesError<T>(message, errno)
    case 507:
      return new InsufficientStorageError<T>(message, errno)
    case 508:
      return new LoopDetectedError<T>(message, errno)
    case 509:
      return new BandwidthLimitExceededError<T>(message, errno)
    case 510:
      return new NotExtendedError<T>(message, errno)
    case 511:
      return new NetworkAuthenticationRequiredError<T>(message, errno)
  }
  return new InternalServerError<T>(
    message ?? `Unknown status ${status}`,
    errno,
  )
}

export function rethrow<S extends Error, D extends Error>(
  Src: new (message?: string) => S,
  Dst: new (message?: string) => D,
): (err: unknown) => never {
  return (err) => {
    throw err instanceof Src ? new Dst(err.message) : err
  }
}

export function supress<V, E extends Error = Error>(
  Err: new (message?: string) => E,
  value?: V,
): (err: unknown) => V | undefined {
  return (err) => {
    if (err instanceof Err) return value
    throw err
  }
}
