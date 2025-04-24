import type {Network} from './types'

import {bigi as BigInteger} from 'bigi'
import {Point} from 'ecurve'

import {
  isBuffer,
  isString,
  isUInt8,
  isUInt16,
  isUInt32,
  isUInt53,
  oneOf,
} from './lib/type-guard'

//TODO: FIXME
import ECSignature = require('./ecsignature')

//Typeguard already exists in numbers.ts
// var UINT31_MAX = Math.pow(2, 31) - 1
// function UInt31 (value) {
//   return typeforce.UInt32(value) && value <= UINT31_MAX
// }

export function BIP32Path(value: unknown): boolean {
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

function isNewtorkVersion(value: unknown): value is number {
  return oneOf([isUInt8, isUInt16], value)
}

export function isNetwork(value: Network): value is Network {
  return (
    oneOf([isBuffer, isString], value.messagePrefix) &&
    isUInt32(value.bip32.public) &&
    isUInt32(value.bip32.private) &&
    isNewtorkVersion(value.pubKeyHash) &&
    isNewtorkVersion(value.scriptHash) &&
    isUInt8(value.wif)
  )
}
// external dependent types
// replacement for
// const BigInt = typeforce.quacksLike('BigInteger')
export function isBigiInt(value: unknown): value is BigInteger {
  return value instanceof BigInteger
}
// const ECPoint = typeforce.quacksLike('Point')
export function isECPoint(value: unknown): value is Point {
  return value instanceof Point
}
//Todo
// exposed, external API
// replacement for ECSignature typeforce to make it more accurate
// const ECSignature = typeforce.compile({ r: BigInt, s: BigInt })
export function isECSignature(value: unknown): value is ECSignature {
  return value instanceof ECSignature
}

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
