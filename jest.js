/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { toBigInt, toDate } from './index.js';
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
export function toBeBigInt(received) {
    const { isNot, promise } = this;
    const comment = 'BigInt type validity';
    const options = { comment, isNot, promise };
    const pass = typeof received === 'bigint';
    const message = getMessage(pass, matcherHint('toBeBigInt', undefined, undefined, options), printReceived(received), printExpected('BigInt'));
    return { message, pass };
}
export function toEqualBigInt(received, expected) {
    const { isNot, promise } = this;
    const comment = 'BigInt equality';
    const options = { comment, isNot, promise };
    const pass = typeof received === 'bigint' && received === toBigInt(expected);
    const message = getMessage(pass, matcherHint('toEqualBigInt', undefined, undefined, options), printReceived(received), printExpected(toBigInt(expected)));
    return { message, pass };
}
export function toEqualDate(received, expected) {
    const { isNot, promise } = this;
    const comment = 'Date type and optional value equality';
    const options = { comment, isNot, promise };
    const pass = received instanceof Date &&
        received.getTime() === toDate(expected).getTime();
    const message = getMessage(pass, matcherHint('toEqualDate', undefined, undefined, options), printReceived(received), printExpected(toDate(expected)));
    return { message, pass };
}
export function toBeTimestamp(received) {
    const { isNot, promise } = this;
    const options = { comment: 'Timestamp type validity', isNot, promise };
    const pass = typeof received === 'number';
    const message = getMessage(pass, matcherHint('toBeTimestamp', undefined, undefined, options), printReceived(received), printExpected('Timestamp'));
    return { message, pass };
}
export function toEqualTimestamp(received, expected) {
    const { isNot, promise } = this;
    const options = { comment: 'Timestamp equality', isNot, promise };
    const pass = typeof received === 'number' &&
        toDate(received).getTime() === toDate(expected).getTime();
    const message = getMessage(pass, matcherHint('toEqualTimestamp', undefined, undefined, options), printReceived(received), printExpected(toDate(expected).getTime()));
    return { message, pass };
}
export function toBeValidTimestamp(received) {
    const { isNot, promise } = this;
    const options = { comment: 'Timestamp validity', isNot, promise };
    const pass = typeof received === 'number' && !isNaN(new Date(received).getTime());
    const message = getMessage(pass, matcherHint('toBeValidTimestamp', undefined, undefined, options), printReceived(received), printExpected('valid timestamp'));
    return { message, pass };
}
function getMessage(pass, hint, received, expected) {
    const not = pass ? 'not ' : '';
    return () => `${hint}\n\nExpected: ${not}${expected}\nReceived: ${received}`;
}
//# sourceMappingURL=jest.js.map