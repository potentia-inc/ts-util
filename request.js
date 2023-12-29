export async function request(url, options = {}) {
    const { timeout, ...init } = options;
    if (timeout !== null && timeout !== undefined) {
        init.signal = AbortSignal.timeout(timeout);
    }
    return await fetch(url, init);
}
//# sourceMappingURL=request.js.map