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
// Single source of truth for status -> class; createHTTPError looks up here
// instead of duplicating the mapping in a switch.
const ERROR_BY_STATUS = new Map([
    [400, BadRequestError],
    [401, UnauthorizedError],
    [402, PaymentRequiredError],
    [403, ForbiddenError],
    [404, NotFoundError],
    [405, MethodNotAllowedError],
    [406, NotAcceptableError],
    [407, ProxyAuthenticationRequiredError],
    [408, RequestTimeoutError],
    [409, ConflictError],
    [410, GoneError],
    [411, LengthRequiredError],
    [412, PreconditionFailedError],
    [413, PayloadTooLargeError],
    [414, URITooLongError],
    [415, UnsupportedMediaTypeError],
    [416, RangeNotSatisfiableError],
    [417, ExpectationFailedError],
    [418, ImaTeapotError],
    [421, MisdirectedRequestError],
    [422, UnprocessableEntityError],
    [423, LockedError],
    [424, FailedDependencyError],
    [425, TooEarlyError],
    [426, UpgradeRequiredError],
    [428, PreconditionRequiredError],
    [429, TooManyRequestsError],
    [431, RequestHeaderFieldsTooLargeError],
    [451, UnavailableForLegalReasonsError],
    [500, InternalServerError],
    [501, NotImplementedError],
    [502, BadGatewayError],
    [503, ServiceUnavailableError],
    [504, GatewayTimeoutError],
    [505, HTTPVersionNotSupportedError],
    [506, VariantAlsoNegotiatesError],
    [507, InsufficientStorageError],
    [508, LoopDetectedError],
    [509, BandwidthLimitExceededError],
    [510, NotExtendedError],
    [511, NetworkAuthenticationRequiredError],
]);
export function createHTTPError(status, message, errno) {
    const Err = ERROR_BY_STATUS.get(status);
    return (Err
        ? new Err(message, errno)
        : new InternalServerError(message ?? `Unknown status ${status}`, errno));
}
export function rethrow(Src, Dst) {
    return (err) => {
        throw err instanceof Src ? new Dst(err.message) : err;
    };
}
export function suppress(Err, value) {
    return (err) => {
        if (err instanceof Err)
            return value;
        throw err;
    };
}
function isErrorLike(error) {
    return (error !== null &&
        typeof error === 'object' &&
        typeof error.message === 'string');
}
export function getMessage(error) {
    return isErrorLike(error) ? error.message : String(error);
}
