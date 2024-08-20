BigInt.prototype.toJSON = function () {
    return this.toString();
};
export const NIL = undefined;
export function toBigInt(x) {
    if (typeof x === 'bigint')
        return x;
    if (typeof x === 'number' || typeof x === 'string')
        return BigInt(x);
    return BigInt(String(x));
}
export function toBigIntOrNil(x) {
    return x === NIL || x === null ? NIL : toBigInt(x);
}
export function toDate(x) {
    if (x instanceof Date)
        return x;
    if (x === NIL || x === null)
        return new Date();
    if (typeof x === 'number' || typeof x === 'string')
        return new Date(x);
    return new Date(String(x));
}
export function toDateOrNil(x) {
    return x === NIL || x === null ? NIL : toDate(x);
}
//# sourceMappingURL=type.js.map