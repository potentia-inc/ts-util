BigInt.prototype.toJSON = function () {
    return this.toString();
};
export const NIL = undefined; // for backward compatibility
export const Nil = undefined;
export function toBigInt(x) {
    if (typeof x === 'bigint')
        return x;
    if (typeof x === 'number' || typeof x === 'string')
        return BigInt(x);
    return BigInt(String(x));
}
export function toBigIntOrNil(x) {
    return isNullish(x) ? Nil : toBigInt(x);
}
export function toDate(x) {
    if (x instanceof Date)
        return x;
    if (isNullish(x))
        return new Date();
    if (typeof x === 'number' || typeof x === 'string')
        return new Date(x);
    return new Date(String(x));
}
export function toDateOrNil(x) {
    return isNullish(x) ? Nil : toDate(x);
}
export function toNumber(x) {
    return typeof x === 'number' ? x : Number(x);
}
export function toNumberOrNil(x) {
    return isNullish(x) ? Nil : toNumber(x);
}
export function toString(x) {
    return typeof x === 'string' ? x : String(x);
}
export function toStringOrNil(x) {
    return isNullish(x) ? Nil : toString(x);
}
export function isNullish(x) {
    return x === null || x === undefined;
}
//# sourceMappingURL=type.js.map