import { constants, createHmac, sign as nodeSign, timingSafeEqual, verify as nodeVerify, } from 'node:crypto';
function rsaPadding(padding) {
    return padding === 'pss'
        ? constants.RSA_PKCS1_PSS_PADDING
        : constants.RSA_PKCS1_PADDING;
}
// Sign `payload` (a string is treated as its UTF-8 bytes) and return the raw
// signature bytes. Encode them (base64url, hex, …) at the boundary as needed.
export async function sign(credential, payload) {
    const data = typeof payload === 'string' ? new TextEncoder().encode(payload) : payload;
    switch (credential.algorithm) {
        case 'hmac':
            return createHmac(credential.hash ?? 'sha512', credential.key)
                .update(data)
                .digest();
        case 'ed25519':
            return nodeSign(undefined, data, {
                key: Buffer.from(credential.key),
                format: 'der',
                type: 'pkcs8',
            });
        case 'rsa':
            return nodeSign(credential.hash ?? 'sha256', data, {
                key: Buffer.from(credential.key),
                format: 'der',
                type: 'pkcs8',
                padding: rsaPadding(credential.padding),
            });
        default:
            throw new Error(`unsupported signature algorithm: ${credential.algorithm}`);
    }
}
// Verify `signature` against `payload`. Returns false on mismatch; throws only
// on an unsupported algorithm or malformed key/input.
export async function verify(credential, payload, signature) {
    const data = typeof payload === 'string' ? new TextEncoder().encode(payload) : payload;
    switch (credential.algorithm) {
        case 'hmac': {
            const expected = await sign(credential, data);
            // Length-guard first: timingSafeEqual throws on a length mismatch, and a
            // MAC's length is not secret; the equal-length path stays constant-time.
            return (expected.length === signature.length &&
                timingSafeEqual(expected, signature));
        }
        case 'ed25519':
            return nodeVerify(undefined, data, { key: Buffer.from(credential.key), format: 'der', type: 'spki' }, signature);
        case 'rsa':
            return nodeVerify(credential.hash ?? 'sha256', data, {
                key: Buffer.from(credential.key),
                format: 'der',
                type: 'spki',
                padding: rsaPadding(credential.padding),
            }, signature);
        default:
            throw new Error(`unsupported signature algorithm: ${credential.algorithm}`);
    }
}
