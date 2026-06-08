export interface MatcherUtils {
    matcherHint: (name: string, received?: string, expected?: string, options?: {
        comment?: string;
        isNot?: boolean;
        promise?: string;
    }) => string;
    printReceived: (value: unknown) => string;
    printExpected: (value: unknown) => string;
}
export interface MatcherContext {
    isNot?: boolean;
    promise?: string;
    utils: MatcherUtils;
}
export interface MatcherResult {
    pass: boolean;
    message: () => string;
}
export interface CustomMatchers<R = unknown> {
    toBeNil(): R;
    toBeBigInt(expected?: unknown): R;
    toEqualBigInt(expected: unknown): R;
    toBeDate(expected?: unknown): R;
    toEqualDate(expected: unknown): R;
    toBeTimestamp(expected?: unknown): R;
    toEqualTimestamp(expected: unknown): R;
    toBeValidTimestamp(): R;
    toBeDateString(): R;
}
type Matcher = (this: MatcherContext, received: unknown, ...rest: unknown[]) => MatcherResult;
export declare function toBeNil(this: MatcherContext, received: unknown): MatcherResult;
export declare const toBeBigInt: Matcher;
export declare const toEqualBigInt: Matcher;
export declare const toBeDate: Matcher;
export declare const toEqualDate: Matcher;
export declare const toBeTimestamp: Matcher;
export declare const toEqualTimestamp: Matcher;
export declare function toBeValidTimestamp(this: MatcherContext, received: unknown): MatcherResult;
export declare function toBeDateString(this: MatcherContext, received: unknown): MatcherResult;
export {};
