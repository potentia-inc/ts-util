export declare class HTTPError extends Error {
    no: number;
    status: number;
    code: string;
    missing?: string[];
    invalid?: string[];
    constructor(message?: string, no?: number, status?: number);
    toJSON(): unknown;
}
export declare class ClientError extends HTTPError {
    constructor(message?: string, no?: number, status?: number);
}
export declare class ServerError extends HTTPError {
    constructor(message?: string, no?: number, status?: number);
}
export declare class BadRequestError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class UnauthorizedError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class PaymentRequiredError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class ForbiddenError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class NotFoundError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class MethodNotAllowedError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class NotAcceptableError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class ProxyAuthenticationRequiredError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class RequestTimeoutError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class ConflictError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class GoneError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class LengthRequiredError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class PreconditionFailedError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class PayloadTooLargeError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class URITooLongError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class UnsupportedMediaTypeError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class RangeNotSatisfiableError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class ExpectationFailedError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class ImaTeapotError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class MisdirectedRequestError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class UnprocessableEntityError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class LockedError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class FailedDependencyError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class TooEarlyError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class UpgradeRequiredError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class PreconditionRequiredError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class TooManyRequestsError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class RequestHeaderFieldsTooLargeError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class UnavailableForLegalReasonsError extends ClientError {
    constructor(message?: string, no?: number);
}
export declare class InternalServerError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class NotImplementedError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class BadGatewayError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class ServiceUnavailableError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class GatewayTimeoutError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class HTTPVersionNotSupportedError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class VariantAlsoNegotiatesError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class InsufficientStorageError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class LoopDetectedError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class BandwidthLimitExceededError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class NotExtendedError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare class NetworkAuthenticationRequiredError extends ServerError {
    constructor(message?: string, no?: number);
}
export declare function createHTTPError(status: number, message?: string, no?: number): HTTPError;
export declare function rethrow<S, D>(Src: new (message?: string) => S, Dst: new (message?: string) => D): (err: unknown) => never;
export declare function supress<E, V>(Err: new (message?: string) => E, value?: V): (err: unknown) => V | undefined;
