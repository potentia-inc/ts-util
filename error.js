import assert from 'node:assert';
export class HTTPError extends Error {
    errno;
    status;
    constructor(message, errno, status) {
        super(message ?? 'HTTP Error');
        this.name = 'HTTPError';
        this.status = status ?? 500;
        this.errno = errno;
    }
}
export class ClientError extends HTTPError {
    constructor(message, errno, status) {
        super(message ?? 'Client Error', errno, status ?? 400);
        assert(this.status >= 400 && this.status < 500);
        this.name = 'ClientError';
    }
}
export class ServerError extends HTTPError {
    constructor(message, errno, status) {
        super(message ?? 'Server Error', errno, status ?? 500);
        assert(this.status >= 500 && this.status < 600);
        this.name = 'ServerError';
    }
}
export class BadRequestError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Bad Request', errno, 400);
        this.name = 'BadRequestError';
    }
}
export class UnauthorizedError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Unauthorized', errno, 401);
        this.name = 'UnauthorizedError';
    }
}
export class PaymentRequiredError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Payment Required', errno, 402);
        this.name = 'PaymentRequiredError';
    }
}
export class ForbiddenError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Forbidden', errno, 403);
        this.name = 'ForbiddenError';
    }
}
export class NotFoundError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Not Found', errno, 404);
        this.name = 'NotFoundError';
    }
}
export class MethodNotAllowedError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Method Not Allowed', errno, 405);
        this.name = 'MethodNotAllowedError';
    }
}
export class NotAcceptableError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Not Acceptable', errno, 406);
        this.name = 'NotAcceptableError';
    }
}
export class ProxyAuthenticationRequiredError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Proxy Authentication Required', errno, 407);
        this.name = 'ProxyAuthenticationRequiredError';
    }
}
export class RequestTimeoutError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Request Timeout', errno, 408);
        this.name = 'RequestTimeoutError';
    }
}
export class ConflictError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Conflict', errno, 409);
        this.name = 'ConflictError';
    }
}
export class GoneError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Gone', errno, 410);
        this.name = 'GoneError';
    }
}
export class LengthRequiredError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Length Required', errno, 411);
        this.name = 'LengthRequiredError';
    }
}
export class PreconditionFailedError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Precondition Failed', errno, 412);
        this.name = 'PreconditionFailedError';
    }
}
export class PayloadTooLargeError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Payload Too Large', errno, 413);
        this.name = 'PayloadTooLargeError';
    }
}
export class URITooLongError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'URI Too Long', errno, 414);
        this.name = 'URITooLongError';
    }
}
export class UnsupportedMediaTypeError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Unsupported Media Type', errno, 415);
        this.name = 'UnsupportedMediaTypeError';
    }
}
export class RangeNotSatisfiableError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Range Not Satisfiable', errno, 416);
        this.name = 'RangeNotSatisfiableError';
    }
}
export class ExpectationFailedError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Expectation Failed', errno, 417);
        this.name = 'ExpectationFailedError';
    }
}
export class ImaTeapotError extends ClientError {
    constructor(message, errno) {
        super(message ?? "I'm a Teapot", errno, 418);
        this.name = 'ImaTeapotError';
    }
}
export class MisdirectedRequestError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Misdirected Request', errno, 421);
        this.name = 'MisdirectedRequestError';
    }
}
export class UnprocessableEntityError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Unprocessable Entity', errno, 422);
        this.name = 'UnprocessableEntityError';
    }
}
export class LockedError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Locked', errno, 423);
        this.name = 'LockedError';
    }
}
export class FailedDependencyError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Failed Dependency', errno, 424);
        this.name = 'FailedDependencyError';
    }
}
export class TooEarlyError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Too Early', errno, 425);
        this.name = 'TooEarlyError';
    }
}
export class UpgradeRequiredError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Upgrade Required', errno, 426);
        this.name = 'UpgradeRequiredError';
    }
}
export class PreconditionRequiredError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Precondition Required', errno, 428);
        this.name = 'PreconditionRequiredError';
    }
}
export class TooManyRequestsError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Too Many Requests', errno, 429);
        this.name = 'TooManyRequestsError';
    }
}
export class RequestHeaderFieldsTooLargeError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Request Header Fields Too Large', errno, 431);
        this.name = 'RequestHeaderFieldsTooLargeError';
    }
}
export class UnavailableForLegalReasonsError extends ClientError {
    constructor(message, errno) {
        super(message ?? 'Unavailable For Legal Reasons', errno, 451);
        this.name = 'UnavailableForLegalReasonsError';
    }
}
export class InternalServerError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Internal Server Error', errno, 500);
        this.name = 'InternalServerError';
    }
}
export class NotImplementedError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Not Implemented', errno, 501);
        this.name = 'NotImplementedError';
    }
}
export class BadGatewayError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Bad Gateway', errno, 502);
        this.name = 'BadGatewayError';
    }
}
export class ServiceUnavailableError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Service Unavailable', errno, 503);
        this.name = 'ServiceUnavailableError';
    }
}
export class GatewayTimeoutError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Gateway Timeout', errno, 504);
        this.name = 'GatewayTimeoutError';
    }
}
export class HTTPVersionNotSupportedError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'HTTP Version Not Supported', errno, 505);
        this.name = 'HTTPVersionNotSupportedError';
    }
}
export class VariantAlsoNegotiatesError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Variant Also Negotiates', errno, 506);
        this.name = 'VariantAlsoNegotiatesError';
    }
}
export class InsufficientStorageError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Insufficient Storage', errno, 507);
        this.name = 'InsufficientStorageError';
    }
}
export class LoopDetectedError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Loop Detected', errno, 508);
        this.name = 'LoopDetectedError';
    }
}
export class BandwidthLimitExceededError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Bandwidth Limit Exceeded', errno, 509);
        this.name = 'BandwidthLimitExceededError';
    }
}
export class NotExtendedError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Not Extended', errno, 510);
        this.name = 'NotExtendedError';
    }
}
export class NetworkAuthenticationRequiredError extends ServerError {
    constructor(message, errno) {
        super(message ?? 'Network Authentication Required', errno, 511);
        this.name = 'NetworkAuthenticationRequiredError';
    }
}
export function createHTTPError(status, message, errno) {
    switch (status) {
        case 400:
            return new BadRequestError(message, errno);
        case 401:
            return new UnauthorizedError(message, errno);
        case 402:
            return new PaymentRequiredError(message, errno);
        case 403:
            return new ForbiddenError(message, errno);
        case 404:
            return new NotFoundError(message, errno);
        case 405:
            return new MethodNotAllowedError(message, errno);
        case 406:
            return new NotAcceptableError(message, errno);
        case 407:
            return new ProxyAuthenticationRequiredError(message, errno);
        case 408:
            return new RequestTimeoutError(message, errno);
        case 409:
            return new ConflictError(message, errno);
        case 410:
            return new GoneError(message, errno);
        case 411:
            return new LengthRequiredError(message, errno);
        case 412:
            return new PreconditionFailedError(message, errno);
        case 413:
            return new PayloadTooLargeError(message, errno);
        case 414:
            return new URITooLongError(message, errno);
        case 415:
            return new UnsupportedMediaTypeError(message, errno);
        case 416:
            return new RangeNotSatisfiableError(message, errno);
        case 417:
            return new ExpectationFailedError(message, errno);
        case 418:
            return new ImaTeapotError(message, errno);
        case 421:
            return new MisdirectedRequestError(message, errno);
        case 422:
            return new UnprocessableEntityError(message, errno);
        case 423:
            return new LockedError(message, errno);
        case 424:
            return new FailedDependencyError(message, errno);
        case 425:
            return new TooEarlyError(message, errno);
        case 426:
            return new UpgradeRequiredError(message, errno);
        case 428:
            return new PreconditionRequiredError(message, errno);
        case 429:
            return new TooManyRequestsError(message, errno);
        case 431:
            return new RequestHeaderFieldsTooLargeError(message, errno);
        case 451:
            return new UnavailableForLegalReasonsError(message, errno);
        case 500:
            return new InternalServerError(message, errno);
        case 501:
            return new NotImplementedError(message, errno);
        case 502:
            return new BadGatewayError(message, errno);
        case 503:
            return new ServiceUnavailableError(message, errno);
        case 504:
            return new GatewayTimeoutError(message, errno);
        case 505:
            return new HTTPVersionNotSupportedError(message, errno);
        case 506:
            return new VariantAlsoNegotiatesError(message, errno);
        case 507:
            return new InsufficientStorageError(message, errno);
        case 508:
            return new LoopDetectedError(message, errno);
        case 509:
            return new BandwidthLimitExceededError(message, errno);
        case 510:
            return new NotExtendedError(message, errno);
        case 511:
            return new NetworkAuthenticationRequiredError(message, errno);
    }
    return new InternalServerError(message ?? `Unknown status ${status}`, errno);
}
export function rethrow(Src, Dst) {
    return (err) => {
        throw err instanceof Src ? new Dst(err.message) : err;
    };
}
export function supress(Err, value) {
    return (err) => {
        if (err instanceof Err)
            return value;
        throw err;
    };
}
//# sourceMappingURL=error.js.map