import { NIL } from './type.js'

export async function request(
  url: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> {
  const { timeout, ...init } = options
  if (timeout !== NIL && timeout !== null)
    init.signal = AbortSignal.timeout(timeout)
  const _url = new URL(url)
  const { username, password } = _url
  _url.username = ''
  _url.password = ''
  const authorization =
    username === '' && password === ''
      ? NIL
      : `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  return await fetch(
    _url.toString(),
    authorization === NIL
      ? init
      : {
          ...init,
          headers: {
            ...(init.headers ?? {}),
            authorization,
          },
        },
  )
}
