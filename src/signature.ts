import {
  constants,
  createHmac,
  sign as nodeSign,
  timingSafeEqual,
  verify as nodeVerify,
} from 'node:crypto'

type Hash = 'sha256' | 'sha384' | 'sha512'

// A credential bundles an algorithm with its parameters and the raw key bytes,
// so one sign/verify pair dispatches over every backend by data (a
// discriminated union on `algorithm`). `key` is always raw binary — the HMAC
// shared secret, or the DER-encoded asymmetric key (PKCS#8 private key when
// signing, SPKI public key when verifying). Higher layers handle PEM <-> DER
// (and any other key encoding).
export type Credential =
  | { algorithm: 'hmac'; hash?: Hash; key: Uint8Array }
  | { algorithm: 'ed25519'; key: Uint8Array }
  | {
      algorithm: 'rsa'
      hash?: Hash
      padding?: 'pkcs1' | 'pss'
      key: Uint8Array
    }

function rsaPadding(padding?: 'pkcs1' | 'pss'): number {
  return padding === 'pss'
    ? constants.RSA_PKCS1_PSS_PADDING
    : constants.RSA_PKCS1_PADDING
}

// Sign `payload` (a string is treated as its UTF-8 bytes) and return the raw
// signature bytes. Encode them (base64url, hex, …) at the boundary as needed.
export async function sign(
  credential: Credential,
  payload: string | Uint8Array,
): Promise<Uint8Array> {
  const data =
    typeof payload === 'string' ? new TextEncoder().encode(payload) : payload
  switch (credential.algorithm) {
    case 'hmac':
      return createHmac(credential.hash ?? 'sha512', credential.key)
        .update(data)
        .digest()
    case 'ed25519':
      return nodeSign(undefined, data, {
        key: Buffer.from(credential.key),
        format: 'der',
        type: 'pkcs8',
      })
    case 'rsa':
      return nodeSign(credential.hash ?? 'sha256', data, {
        key: Buffer.from(credential.key),
        format: 'der',
        type: 'pkcs8',
        padding: rsaPadding(credential.padding),
      })
    default:
      throw new Error(
        `unsupported signature algorithm: ${(credential as { algorithm: string }).algorithm}`,
      )
  }
}

// Verify `signature` against `payload`. Returns false on mismatch; throws only
// on an unsupported algorithm or malformed key/input.
export async function verify(
  credential: Credential,
  payload: string | Uint8Array,
  signature: Uint8Array,
): Promise<boolean> {
  const data =
    typeof payload === 'string' ? new TextEncoder().encode(payload) : payload
  switch (credential.algorithm) {
    case 'hmac': {
      const expected = await sign(credential, data)
      // Length-guard first: timingSafeEqual throws on a length mismatch, and a
      // MAC's length is not secret; the equal-length path stays constant-time.
      return (
        expected.length === signature.length &&
        timingSafeEqual(expected, signature)
      )
    }
    case 'ed25519':
      return nodeVerify(
        undefined,
        data,
        { key: Buffer.from(credential.key), format: 'der', type: 'spki' },
        signature,
      )
    case 'rsa':
      return nodeVerify(
        credential.hash ?? 'sha256',
        data,
        {
          key: Buffer.from(credential.key),
          format: 'der',
          type: 'spki',
          padding: rsaPadding(credential.padding),
        },
        signature,
      )
    default:
      throw new Error(
        `unsupported signature algorithm: ${(credential as { algorithm: string }).algorithm}`,
      )
  }
}
