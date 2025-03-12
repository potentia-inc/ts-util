import { Nil, isNullish } from './type.js';
export async function request(url, options = {}) {
    const { timeout, ...init } = options;
    if (!isNullish(timeout))
        init.signal = AbortSignal.timeout(timeout);
    const _url = new URL(url);
    const { username, password } = _url;
    _url.username = '';
    _url.password = '';
    const authorization = username === '' && password === ''
        ? Nil
        : `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    return await fetch(_url.toString(), authorization === Nil
        ? init
        : {
            ...init,
            headers: {
                ...(init.headers ?? {}),
                authorization,
            },
        });
}
//# sourceMappingURL=request.js.map