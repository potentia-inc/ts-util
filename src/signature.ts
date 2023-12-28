import { createHmac, timingSafeEqual } from 'node:crypto'

export function sign(
  algorithm: string,
  key: string,
  content: string | Buffer,
): Buffer {
  return createHmac(algorithm, key).update(content).digest()
}

export function verify(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b)
}
