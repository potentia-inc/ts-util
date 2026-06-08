export const Nil = undefined;
// Strict coercions: throw on nullish and on unparseable input.
// The `...OrNil` variants return Nil for nullish but still throw on invalid.
export function toBigInt(x) {
    if (typeof x === 'bigint')
        return x;
    if (typeof x === 'number' ||
        typeof x === 'string' ||
        typeof x === 'boolean') {
        return BigInt(x);
    }
    throw new TypeError(`cannot convert ${typeof x} to a bigint`);
}
export function toBigIntOrNil(x) {
    return isNullish(x) ? Nil : toBigInt(x);
}
export function toDate(x) {
    if (isNullish(x)) {
        throw new TypeError('cannot convert null or undefined to a Date');
    }
    const date = x instanceof Date
        ? x
        : new Date(typeof x === 'number' || typeof x === 'string' ? x : String(x));
    if (isNaN(date.getTime())) {
        throw new TypeError(`cannot convert to a valid Date: ${String(x)}`);
    }
    return date;
}
export function toDateOrNil(x) {
    return isNullish(x) ? Nil : toDate(x);
}
export function toNumber(x) {
    if (isNullish(x)) {
        throw new TypeError('cannot convert null or undefined to a number');
    }
    if (typeof x === 'number')
        return x;
    const n = Number(x);
    if (isNaN(n))
        throw new TypeError(`cannot convert to a number: ${String(x)}`);
    return n;
}
export function toNumberOrNil(x) {
    return isNullish(x) ? Nil : toNumber(x);
}
export function toString(x) {
    if (isNullish(x)) {
        throw new TypeError('cannot convert null or undefined to a string');
    }
    return typeof x === 'string' ? x : String(x);
}
export function toStringOrNil(x) {
    return isNullish(x) ? Nil : toString(x);
}
export function isNullish(x) {
    return x === null || x === undefined;
}
