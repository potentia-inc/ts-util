interface CustomMatchers<R = unknown> {
    toBeBigInt: (this: unknown) => R;
    toEqualBigInt: (this: unknown, expected: unknown) => R;
    toEqualDate: (this: unknown, expected: unknown) => R;
    toBeTimestamp: (this: unknown) => R;
    toEqualTimestamp: (this: unknown, expected: unknown) => R;
    toBeValidTimestamp: (this: unknown) => R;
}
declare global {
    namespace jest {
        interface Expect extends CustomMatchers {
        }
        interface Matchers<R> extends CustomMatchers<R> {
        }
        interface InverseAsymmetricMatchers extends CustomMatchers {
        }
    }
}
export declare function toBeBigInt(this: unknown, received: unknown): jest.CustomMatcherResult;
export declare function toEqualBigInt(this: unknown, received: unknown, expected: unknown): jest.CustomMatcherResult;
export declare function toEqualDate(this: unknown, received: unknown, expected: unknown): jest.CustomMatcherResult;
export declare function toBeTimestamp(this: unknown, received: unknown): jest.CustomMatcherResult;
export declare function toEqualTimestamp(this: unknown, received: unknown, expected: unknown): jest.CustomMatcherResult;
export declare function toBeValidTimestamp(this: unknown, received: unknown): jest.CustomMatcherResult;
export {};
