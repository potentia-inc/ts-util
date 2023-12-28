export async function request(
  url: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<Response> {
  const { timeout, ...init } = options
  if (timeout !== null && timeout !== undefined) {
    init.signal = AbortSignal.timeout(timeout)
  }
  return await fetch(url, init)
}
