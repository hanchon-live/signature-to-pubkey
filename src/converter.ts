import { fromRpcSig } from "@ethereumjs/util";
import { recoverPublicKey } from "ethereum-cryptography/secp256k1";
import { setLengthLeft } from "@ethereumjs/util";

function calculateSigRecovery(v: bigint, chainId?: bigint): bigint {
  if (v === BigInt(0) || v === BigInt(1)) return v;

  if (chainId === undefined) {
    return v - BigInt(27);
  }
  return v - (chainId * BigInt(2) + BigInt(35));
}

function isValidSigRecovery(recovery: bigint): boolean {
  return recovery === BigInt(0) || recovery === BigInt(1);
}

export const recoverPubKey = function (
  msgHash: Buffer,
  v: bigint,
  r: Buffer,
  s: Buffer,
  chainId?: bigint
): string {
  const signature = Buffer.concat(
    [setLengthLeft(r, 32), setLengthLeft(s, 32)],
    64
  );
  const recovery = calculateSigRecovery(v, chainId);
  if (!isValidSigRecovery(recovery)) {
    throw new Error("Invalid signature v value");
  }

  const senderPubKey = recoverPublicKey(
    msgHash,
    signature,
    Number(recovery),
    true
  );
  return Buffer.from(senderPubKey).toString("base64");
};

export function signatureToPubkey(signature: string, msgHash: Buffer) {
  let ret = fromRpcSig(signature);
  return recoverPubKey(msgHash, ret.v, ret.r, ret.s);
}

export function fromHexString(hexString: string) {
  let match = hexString.match(/.{1,2}/g);
  if (match === null) {
    return new Uint8Array();
  }
  return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
}
