import { option } from './misc.js';
export class HTTPError extends Error {
    constructor(message, no, status) {
        super(message ?? 'Unknown HTTP Error');
        this.name = 'HTTPError';
        this.status = status ?? 500;
        this.no = no ?? 0;
        this.code = `E:${this.status}:${this.no}`;
    }
    toJSON() {
        return {
            name: this.name,
            status: this.status,
            no: this.no,
            code: this.code,
            message: this.message,
            ...option('missing', this.missing),
            ...option('invalid', this.invalid),
        };
    }
}
export class ClientError extends HTTPError {
    constructor(message, no, status) {
        super(message ?? 'Client Error', no ?? 0, status ?? 400);
        this.name = 'ClientError';
    }
}
export class ServerError extends HTTPError {
    constructor(message, no, status) {
        super(message ?? 'Server Error', no ?? 0, status ?? 500);
        this.name = 'ServerError';
    }
}
export class BadRequestError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Bad Request', no ?? 0, 400);
        this.name = 'BadRequestError';
    }
}
export class UnauthorizedError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Unauthorized', no ?? 0, 401);
        this.name = 'UnauthorizedError';
    }
}
export class PaymentRequiredError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Payment Required', no ?? 0, 402);
        this.name = 'PaymentRequiredError';
    }
}
export class ForbiddenError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Forbidden', no ?? 0, 403);
        this.name = 'ForbiddenError';
    }
}
export class NotFoundError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Not Found', no ?? 0, 404);
        this.name = 'NotFoundError';
    }
}
export class MethodNotAllowedError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Method Not Allowed', no ?? 0, 405);
        this.name = 'MethodNotAllowedError';
    }
}
export class NotAcceptableError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Not Acceptable', no ?? 0, 406);
        this.name = 'NotAcceptableError';
    }
}
export class ProxyAuthenticationRequiredError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Proxy Authentication Required', no ?? 0, 407);
        this.name = 'ProxyAuthenticationRequiredError';
    }
}
export class RequestTimeoutError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Request Timeout', no ?? 0, 408);
        this.name = 'RequestTimeoutError';
    }
}
export class ConflictError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Conflict', no ?? 0, 409);
        this.name = 'ConflictError';
    }
}
export class GoneError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Gone', no ?? 0, 410);
        this.name = 'GoneError';
    }
}
export class LengthRequiredError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Length Required', no ?? 0, 411);
        this.name = 'LengthRequiredError';
    }
}
export class PreconditionFailedError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Precondition Failed', no ?? 0, 412);
        this.name = 'PreconditionFailedError';
    }
}
export class PayloadTooLargeError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Payload Too Large', no ?? 0, 413);
        this.name = 'PayloadTooLargeError';
    }
}
export class URITooLongError extends ClientError {
    constructor(message, no) {
        super(message ?? 'URI Too Long', no ?? 0, 414);
        this.name = 'URITooLongError';
    }
}
export class UnsupportedMediaTypeError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Unsupported Media Type', no ?? 0, 415);
        this.name = 'UnsupportedMediaTypeError';
    }
}
export class RangeNotSatisfiableError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Range Not Satisfiable', no ?? 0, 416);
        this.name = 'RangeNotSatisfiableError';
    }
}
export class ExpectationFailedError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Expectation Failed', no ?? 0, 417);
        this.name = 'ExpectationFailedError';
    }
}
export class ImaTeapotError extends ClientError {
    constructor(message, no) {
        super(message ?? "I'm a Teapot", no ?? 0, 418);
        this.name = 'ImaTeapotError';
    }
}
export class MisdirectedRequestError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Misdirected Request', no ?? 0, 421);
        this.name = 'MisdirectedRequestError';
    }
}
export class UnprocessableEntityError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Unprocessable Entity', no ?? 0, 422);
        this.name = 'UnprocessableEntityError';
    }
}
export class LockedError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Locked', no ?? 0, 423);
        this.name = 'LockedError';
    }
}
export class FailedDependencyError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Failed Dependency', no ?? 0, 424);
        this.name = 'FailedDependencyError';
    }
}
export class TooEarlyError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Too Early', no ?? 0, 425);
        this.name = 'TooEarlyError';
    }
}
export class UpgradeRequiredError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Upgrade Required', no ?? 0, 426);
        this.name = 'UpgradeRequiredError';
    }
}
export class PreconditionRequiredError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Precondition Required', no ?? 0, 428);
        this.name = 'PreconditionRequiredError';
    }
}
export class TooManyRequestsError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Too Many Requests', no ?? 0, 429);
        this.name = 'TooManyRequestsError';
    }
}
export class RequestHeaderFieldsTooLargeError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Request Header Fields Too Large', no ?? 0, 431);
        this.name = 'RequestHeaderFieldsTooLargeError';
    }
}
export class UnavailableForLegalReasonsError extends ClientError {
    constructor(message, no) {
        super(message ?? 'Unavailable For Legal Reasons', no ?? 0, 451);
        this.name = 'UnavailableForLegalReasonsError';
    }
}
export class InternalServerError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Internal Server Error', no ?? 0, 500);
        this.name = 'InternalServerError';
    }
}
export class NotImplementedError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Not Implemented', no ?? 0, 501);
        this.name = 'NotImplementedError';
    }
}
export class BadGatewayError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Bad Gateway', no ?? 0, 502);
        this.name = 'BadGatewayError';
    }
}
export class ServiceUnavailableError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Service Unavailable', no ?? 0, 503);
        this.name = 'ServiceUnavailableError';
    }
}
export class GatewayTimeoutError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Gateway Timeout', no ?? 0, 504);
        this.name = 'GatewayTimeoutError';
    }
}
export class HTTPVersionNotSupportedError extends ServerError {
    constructor(message, no) {
        super(message ?? 'HTTP Version Not Supported', no ?? 0, 505);
        this.name = 'HTTPVersionNotSupportedError';
    }
}
export class VariantAlsoNegotiatesError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Variant Also Negotiates', no ?? 0, 506);
        this.name = 'VariantAlsoNegotiatesError';
    }
}
export class InsufficientStorageError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Insufficient Storage', no ?? 0, 507);
        this.name = 'InsufficientStorageError';
    }
}
export class LoopDetectedError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Loop Detected', no ?? 0, 508);
        this.name = 'LoopDetectedError';
    }
}
export class BandwidthLimitExceededError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Bandwidth Limit Exceeded', no ?? 0, 509);
        this.name = 'BandwidthLimitExceededError';
    }
}
export class NotExtendedError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Not Extended', no ?? 0, 510);
        this.name = 'NotExtendedError';
    }
}
export class NetworkAuthenticationRequiredError extends ServerError {
    constructor(message, no) {
        super(message ?? 'Network Authentication Required', no ?? 0, 511);
        this.name = 'NetworkAuthenticationRequiredError';
    }
}
export function createHTTPError(status, message, no) {
    switch (status) {
        case 400:
            return new BadRequestError(message, no);
        case 401:
            return new UnauthorizedError(message, no);
        case 402:
            return new PaymentRequiredError(message, no);
        case 403:
            return new ForbiddenError(message, no);
        case 404:
            return new NotFoundError(message, no);
        case 405:
            return new MethodNotAllowedError(message, no);
        case 406:
            return new NotAcceptableError(message, no);
        case 407:
            return new ProxyAuthenticationRequiredError(message, no);
        case 408:
            return new RequestTimeoutError(message, no);
        case 409:
            return new ConflictError(message, no);
        case 410:
            return new GoneError(message, no);
        case 411:
            return new LengthRequiredError(message, no);
        case 412:
            return new PreconditionFailedError(message, no);
        case 413:
            return new PayloadTooLargeError(message, no);
        case 414:
            return new URITooLongError(message, no);
        case 415:
            return new UnsupportedMediaTypeError(message, no);
        case 416:
            return new RangeNotSatisfiableError(message, no);
        case 417:
            return new ExpectationFailedError(message, no);
        case 418:
            return new ImaTeapotError(message, no);
        case 421:
            return new MisdirectedRequestError(message, no);
        case 422:
            return new UnprocessableEntityError(message, no);
        case 423:
            return new LockedError(message, no);
        case 424:
            return new FailedDependencyError(message, no);
        case 425:
            return new TooEarlyError(message, no);
        case 426:
            return new UpgradeRequiredError(message, no);
        case 428:
            return new PreconditionRequiredError(message, no);
        case 429:
            return new TooManyRequestsError(message, no);
        case 431:
            return new RequestHeaderFieldsTooLargeError(message, no);
        case 451:
            return new UnavailableForLegalReasonsError(message, no);
        case 500:
            return new InternalServerError(message, no);
        case 501:
            return new NotImplementedError(message, no);
        case 502:
            return new BadGatewayError(message, no);
        case 503:
            return new ServiceUnavailableError(message, no);
        case 504:
            return new GatewayTimeoutError(message, no);
        case 505:
            return new HTTPVersionNotSupportedError(message, no);
        case 506:
            return new VariantAlsoNegotiatesError(message, no);
        case 507:
            return new InsufficientStorageError(message, no);
        case 508:
            return new LoopDetectedError(message, no);
        case 509:
            return new BandwidthLimitExceededError(message, no);
        case 510:
            return new NotExtendedError(message, no);
        case 511:
            return new NetworkAuthenticationRequiredError(message, no);
    }
    return new InternalServerError(message ?? `Unknown status ${status}`, no);
}
export function rethrow(Src, Dst) {
    return (err) => {
        throw err instanceof Src ? new Dst() : err;
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