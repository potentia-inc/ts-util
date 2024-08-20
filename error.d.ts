import { TypeOrNil } from './type.js';
export declare class HTTPError<T = number> extends Error {
    errno?: T;
    status: number;
    constructor(message?: string, errno?: T, status?: number);
}
export declare class ClientError<T = number> extends HTTPError<T> {
    constructor(message?: string, errno?: T, status?: number);
}
export declare class ServerError<T = number> extends HTTPError<T> {
    constructor(message?: string, errno?: T, status?: number);
}
export declare class BadRequestError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class UnauthorizedError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class PaymentRequiredError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class ForbiddenError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class NotFoundError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class MethodNotAllowedError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class NotAcceptableError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class ProxyAuthenticationRequiredError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class RequestTimeoutError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class ConflictError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class GoneError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class LengthRequiredError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class PreconditionFailedError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class PayloadTooLargeError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class URITooLongError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class UnsupportedMediaTypeError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class RangeNotSatisfiableError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class ExpectationFailedError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class ImaTeapotError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class MisdirectedRequestError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class UnprocessableEntityError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class LockedError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class FailedDependencyError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class TooEarlyError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class UpgradeRequiredError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class PreconditionRequiredError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class TooManyRequestsError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class RequestHeaderFieldsTooLargeError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class UnavailableForLegalReasonsError<T = number> extends ClientError<T> {
    constructor(message?: string, errno?: T);
}
export declare class InternalServerError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class NotImplementedError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class BadGatewayError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class ServiceUnavailableError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class GatewayTimeoutError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class HTTPVersionNotSupportedError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class VariantAlsoNegotiatesError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class InsufficientStorageError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class LoopDetectedError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class BandwidthLimitExceededError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class NotExtendedError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare class NetworkAuthenticationRequiredError<T = number> extends ServerError<T> {
    constructor(message?: string, errno?: T);
}
export declare function createHTTPError<T = number>(status: number, message?: string, errno?: T): HTTPError<T>;
export declare function rethrow<S extends Error, D extends Error>(Src: new (message?: string) => S, Dst: new (message?: string) => D): (err: unknown) => never;
export declare function supress<V, E extends Error = Error>(Err: new (message?: string) => E, value?: V): (err: unknown) => TypeOrNil<V>;
