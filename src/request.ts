import { NIL } from './type.js'
export async function request(
  url: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> {
  const { timeout, ...init } = options
  if (timeout !== NIL && timeout !== null)
    init.signal = AbortSignal.timeout(timeout)
  return await fetch(url, init)
}
