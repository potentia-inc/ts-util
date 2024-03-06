import { createHmac, timingSafeEqual } from 'node:crypto';
export function sign(algorithm, key, content) {
    return createHmac(algorithm, key).update(content).digest();
}
export function verify(a, b) {
    return a.length === b.length && timingSafeEqual(a, b);
}
//# sourceMappingURL=signature.js.map