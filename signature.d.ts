type Hash = 'sha256' | 'sha384' | 'sha512';
export type Credential = {
    algorithm: 'hmac';
    hash?: Hash;
    key: Uint8Array;
} | {
    algorithm: 'ed25519';
    key: Uint8Array;
} | {
    algorithm: 'rsa';
    hash?: Hash;
    padding?: 'pkcs1' | 'pss';
    key: Uint8Array;
};
export declare function sign(credential: Credential, payload: string | Uint8Array): Promise<Uint8Array>;
export declare function verify(credential: Credential, payload: string | Uint8Array, signature: Uint8Array): Promise<boolean>;
export {};
