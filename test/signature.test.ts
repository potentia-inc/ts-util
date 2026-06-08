import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { generateKeyPairSync } from 'node:crypto'
import { sign, verify, type Credential } from '../src/signature.js'

const payload = 'The quick brown fox jumps over the lazy dog'

describe('signature: hmac', () => {
  const secret = new TextEncoder().encode('key')
  // https://en.wikipedia.org/wiki/HMAC
  const vectors = [
    [
      'sha256',
      'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8',
    ],
    [
      'sha512',
      'b42af09057bac1e2d41708e48a902e09b5ff7f12ab428a4fe86653c73dd248fb82f948a549f7b791a5b41915ee4d1ec3935357e4e2317250d0372afa2ebeeb3a',
    ],
  ] as const

  test('sign() returns the raw HMAC bytes', async () => {
    for (const [hash, hex] of vectors) {
      const sig = await sign({ algorithm: 'hmac', hash, key: secret }, payload)
      assert.equal(Buffer.from(sig).toString('hex'), hex)
    }
  })

  test('hash defaults to sha512', async () => {
    const a = await sign({ algorithm: 'hmac', key: secret }, payload)
    const b = await sign(
      { algorithm: 'hmac', hash: 'sha512', key: secret },
      payload,
    )
    assert.deepEqual(Buffer.from(a), Buffer.from(b))
  })

  test('sign() accepts a Uint8Array payload', async () => {
    const sig = await sign(
      { algorithm: 'hmac', hash: 'sha256', key: secret },
      new TextEncoder().encode(payload),
    )
    assert.equal(Buffer.from(sig).toString('hex'), vectors[0][1])
  })

  test('verify() matches a correct signature, rejects a wrong one', async () => {
    const cred: Credential = { algorithm: 'hmac', hash: 'sha256', key: secret }
    const sig = await sign(cred, payload)
    assert.equal(await verify(cred, payload, sig), true)
    assert.equal(
      await verify(cred, new TextEncoder().encode(payload), sig),
      true,
    )
    assert.equal(await verify(cred, payload, Buffer.from('nope')), false)
    assert.equal(await verify(cred, 'tampered', sig), false)
  })
})

describe('signature: ed25519', () => {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519')
  const priv = privateKey.export({ type: 'pkcs8', format: 'der' })
  const pub = publicKey.export({ type: 'spki', format: 'der' })

  test('sign/verify round-trips, rejects a tampered payload', async () => {
    const sig = await sign({ algorithm: 'ed25519', key: priv }, payload)
    assert.equal(
      await verify({ algorithm: 'ed25519', key: pub }, payload, sig),
      true,
    )
    assert.equal(
      await verify({ algorithm: 'ed25519', key: pub }, 'tampered', sig),
      false,
    )
  })
})

describe('signature: rsa', () => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  })
  const priv = privateKey.export({ type: 'pkcs8', format: 'der' })
  const pub = publicKey.export({ type: 'spki', format: 'der' })

  // exercise default hash (pkcs1) and an explicit hash (pss)
  const cases = [
    { padding: 'pkcs1', hash: undefined },
    { padding: 'pss', hash: 'sha384' },
  ] as const
  for (const { padding, hash } of cases) {
    test(`sign/verify round-trips with ${padding} padding`, async () => {
      const sig = await sign(
        { algorithm: 'rsa', hash, padding, key: priv },
        payload,
      )
      assert.equal(
        await verify(
          { algorithm: 'rsa', hash, padding, key: pub },
          payload,
          sig,
        ),
        true,
      )
      assert.equal(
        await verify(
          { algorithm: 'rsa', hash, padding, key: pub },
          'tampered',
          sig,
        ),
        false,
      )
    })
  }
})

describe('signature', () => {
  test('unsupported algorithm throws', async () => {
    const cred = {
      algorithm: 'dsa',
      key: new Uint8Array(),
    } as unknown as Credential
    await assert.rejects(sign(cred, payload), /unsupported/)
    await assert.rejects(verify(cred, payload, new Uint8Array()), /unsupported/)
  })
})
