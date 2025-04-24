;

// var typeforce = require('typeforce')

import {isString, isUInt53} from './lib/type-guard'





;








//Typeguard lib numbers.ts
// var UINT31_MAX = Math.pow(2, 31) - 1
// function UInt31 (value) {
//   return typeforce.UInt32(value) && value <= UINT31_MAX
// }

export function BIP32Path(value: unknown):boolean {
  return isString(value) && !!value.match(/^(m\/)?(\d+'?\/)*\d+'?$/)
}
BIP32Path.toJSON = function () {
  return 'BIP32 derivation path'
}

export function isBIP32Path(value: unknown): boolean {
  return !!BIP32Path(value)
}

const SATOSHI_MAX = 21 * 1e14
export function isSatoshi(value: unknown): boolean {
  return isUInt53(value) && <number>value <= SATOSHI_MAX
}

// external dependent types
//Todo
// const BigInt = typeforce.quacksLike('BigInteger')
// const ECPoint = typeforce.quacksLike('Point')
//Todo
// exposed, external API
// const ECSignature = typeforce.compile({ r: BigInt, s: BigInt })
// const networkVersion = typeforce.oneOf(typeforce.UInt8, typeforce.UInt16)
// const Network = typeforce.compile({
  // messagePrefix: typeforce.oneOf(typeforce.Buffer, typeforce.String),
  // bip32: {
    // public: typeforce.UInt32,
    // private: typeforce.UInt32
  // },
  // pubKeyHash: networkVersion,
  // scriptHash: networkVersion,
  // wif: typeforce.UInt8
// })


// export function isDefinedHashType(hashType: number):hashType is number {
//   const hashTypeMod = hashType & ~0xc0

//   // return hashTypeMod > SIGHASH_ALL && hashTypeMod < SIGHASH_SINGLE
//   return hashTypeMod > 0x00 && hashTypeMod < 0x04
// }
// import * as OPS from 'bitcoin-ops/index.json'

// import {isArray, isBuffer, isNumber} from '.'

// export const OP_INT_BASE = OPS.OP_RESERVED // OP_1 - 1

// export function isOPInt(value: unknown) {
//   return (
//     isNumber(value) &&
//     (value === OPS.OP_0 ||
//       (value >= OPS.OP_1 && value <= OPS.OP_16) ||
//       value === OPS.OP_1NEGATE)
//   )
// }

// export function isPushOnlyChunk(value: unknown) {
//   return isBuffer(value) || isOPInt(value)
// }

// export function isPushOnly(value: unknown) {
//   return isArray(value) && value.every(isPushOnlyChunk)
// }

// export function asMinimalOP(buffer: Buffer) {
  
//   if (buffer.length === 0) return OPS.OP_0
//   if (buffer.length !== 1) return
//   if (buffer[0] >= 1 && buffer[0] <= 16) return OP_INT_BASE + buffer[0]
//   if (buffer[0] === 0x81) return OPS.OP_1NEGATE
// }
