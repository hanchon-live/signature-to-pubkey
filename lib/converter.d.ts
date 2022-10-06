/// <reference types="node" />
export declare const recoverPubKey: (msgHash: Buffer, v: bigint, r: Buffer, s: Buffer, chainId?: bigint | undefined) => string;
export declare function signatureToPubkey(signature: string, msgHash: Buffer): string;
export declare function fromHexString(hexString: string): Uint8Array;
