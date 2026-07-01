import { Nil, toBigInt, toDate } from '../type.js';
// Sentinel for "no expected argument was passed" — distinct from `undefined`,
// which is a real value to compare against (so toBeBigInt() is a type check but
// toBeBigInt(undefined) is an equality check that fails).
const TYPE_ONLY = Symbol('type-only');
// Validate the argument count once (shared by every matcher) and report the
// mode: TYPE_ONLY when no argument was passed, else the expected value.
function expected(name, rest) {
    if (rest.length > 1)
        throw new Error(`${name}: expected at most one argument`);
    return rest.length === 0 ? TYPE_ONLY : rest[0];
}
function build(ctx, name, comment, pass, received, shown) {
    const { isNot, promise, utils } = ctx;
    const hint = utils.matcherHint(name, Nil, Nil, { comment, isNot, promise });
    const not = pass ? 'not ' : '';
    return {
        pass,
        message: () => `${hint}\n\nExpected: ${not}${utils.printExpected(shown)}\n` +
            `Received: ${utils.printReceived(received)}`,
    };
}
// Build a matcher that checks `isType` alone (no argument) or type plus value
// equality (one argument). `convert` turns the expected argument into the value
// compared and displayed; a conversion that throws (e.g. an undefined or
// unparseable expected) counts as "not equal" rather than erroring.
function combined(name, label, isType, convert, equals) {
    return function (received, ...rest) {
        const arg = expected(name, rest);
        if (arg === TYPE_ONLY) {
            return build(this, name, `${label} type`, isType(received), received, label);
        }
        let pass;
        let shown = arg;
        try {
            shown = convert(arg);
            pass = isType(received) && equals(received, shown);
        }
        catch {
            pass = false;
        }
        return build(this, name, `${label} equality`, pass, received, shown);
    };
}
export function toBeNil(received) {
    return build(this, 'toBeNil', 'Nil', received === Nil, received, 'Nil');
}
export const toBeBigInt = combined('toBeBigInt', 'BigInt', (received) => typeof received === 'bigint', (expected) => toBigInt(expected), (received, expected) => received === expected);
export const toEqualBigInt = toBeBigInt;
export const toBeDate = combined('toBeDate', 'Date', (received) => received instanceof Date, (expected) => toDate(expected), (received, expected) => received.getTime() === expected.getTime());
export const toEqualDate = toBeDate;
export const toBeTimestamp = combined('toBeTimestamp', 'Timestamp', (received) => typeof received === 'number', (expected) => toDate(expected).getTime(), (received, expected) => toDate(received).getTime() === expected);
export const toEqualTimestamp = toBeTimestamp;
export function toBeValidTimestamp(received) {
    const pass = typeof received === 'number' && !isNaN(new Date(received).getTime());
    return build(this, 'toBeValidTimestamp', 'Timestamp validity', pass, received, 'valid timestamp');
}
export function toBeDateString(received) {
    const pass = typeof received === 'string' && !isNaN(new Date(received).getTime());
    return build(this, 'toBeDateString', 'Date string validity', pass, received, 'date string');
}
