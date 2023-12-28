import { sign, verify } from '../src/signature.js'

describe('signature', () => {
  // https://en.wikipedia.org/wiki/HMAC
  const key = 'key'
  const content = 'The quick brown fox jumps over the lazy dog'
  const pairs = [
    ['md5', '80070713463e7749b90c2dc24911e275'],
    ['sha1', 'de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9'],
    [
      'sha256',
      'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8',
    ],
    [
      'sha512',
      'b42af09057bac1e2d41708e48a902e09b5ff7f12ab428a4fe86653c73dd248fb82f948a549f7b791a5b41915ee4d1ec3935357e4e2317250d0372afa2ebeeb3a',
    ],
  ]

  test('sign()', () => {
    for (const [algo, hex] of pairs) {
      expect(sign(algo, key, content).toString('hex')).toBe(hex)
    }
  })

  test('verify()', () => {
    for (const [algo, hex] of pairs) {
      expect(
        verify(sign(algo, key, content), Buffer.from(hex, 'hex')),
      ).toBeTruthy()
      expect(
        verify(sign(algo, key, content), Buffer.from('foobar')),
      ).toBeFalsy()
    }
  })
})
