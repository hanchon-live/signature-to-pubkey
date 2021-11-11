import { fromRpcSig } from "ethereumjs-util";

const secp256k1_1 = require("ethereum-cryptography/secp256k1");
const bytes_1 = require("ethereumjs-util/dist/bytes");
const types_1 = require("ethereumjs-util/dist/types");

function calculateSigRecovery(v: any, chainId: any) {
  const vBN = (types_1.toType)(v, types_1.TypeOutput.BN);
  if (!chainId) {
    return vBN.subn(27);
  }
  const chainIdBN = (types_1.toType)(chainId, types_1.TypeOutput.BN);
  return vBN.sub(chainIdBN.muln(2).addn(35));
}

function isValidSigRecovery(recovery: any) {
  return recovery == 0 || recovery == 1
}

function recoverPubKey(msgHash: Buffer, v: any, r: Buffer, s: Buffer, chainId?: any) {
  const signature = Buffer.concat([(bytes_1.setLengthLeft)(r, 32), (bytes_1.setLengthLeft)(s, 32)], 64);
  const recovery = calculateSigRecovery(v, chainId);
  if (!isValidSigRecovery(recovery)) {
    throw new Error('Invalid signature v value');
  }
  const senderPubKey = (secp256k1_1.ecdsaRecover)(signature, recovery.toNumber(), msgHash);
  return Buffer.from(senderPubKey).toString('base64');
}

export function signatureToPubkey(signature: string, msgHash: Buffer) {
  let ret = fromRpcSig(signature)
  return recoverPubKey(msgHash, ret.v, ret.r, ret.s)
}

export function fromHexString(hexString: string) {
  let match = hexString.match(/.{1,2}/g)
  if (match === null) {
    return new Uint8Array()
  }
  return new Uint8Array(match.map(byte => parseInt(byte, 16)));
}