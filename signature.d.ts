/// <reference types="node" />
export declare function sign(algorithm: string, key: string, content: string | Buffer): Buffer;
export declare function verify(a: Buffer, b: Buffer): boolean;
