import { isNullish } from './type.js'
import { toMs, type Duration } from './duration.js'

// A `fetch` wrapper adding a `timeout` (a Duration) and URL-credential -> Basic
// auth support. It calls the native fetch via `globalThis.fetch` — this
// module's own `fetch` binding shadows the global only for unqualified
// references, so `globalThis.fetch` always reaches the real one.
export async function fetch(
  url: string,
  options: RequestInit & { timeout?: Duration } = {},
): Promise<Response> {
  const { timeout, ...init } = options
  if (!isNullish(timeout)) {
    // Combine with any caller-provided signal instead of overwriting it.
    const timeoutSignal = AbortSignal.timeout(toMs(timeout))
    init.signal = init.signal
      ? AbortSignal.any([init.signal, timeoutSignal])
      : timeoutSignal
  }
  const _url = new URL(url)
  const { username, password } = _url
  _url.username = ''
  _url.password = ''
  if (username !== '' || password !== '') {
    // Normalize via Headers so callers may pass a Headers/array/object; a plain
    // spread would drop the entries of a Headers instance. Percent-decode the
    // URL credentials before encoding them for the header.
    const headers = new Headers(init.headers)
    const userpass = `${decodeURIComponent(username)}:${decodeURIComponent(password)}`
    headers.set(
      'authorization',
      `Basic ${Buffer.from(userpass).toString('base64')}`,
    )
    init.headers = headers
  }
  return await globalThis.fetch(_url.toString(), init)
}
