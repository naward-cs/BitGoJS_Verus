// OP_0 {pubKeyHash}
// number {Buffer}

import type {Stack} from '../../types'

import typeGuard, {isHash160bit} from '../../lib/type-guard'
import {OPS} from '../../opcodes'
import bscript from '../../script'

export function check(script: Buffer | Stack): boolean {
  const buffer = bscript.compile(script)

  return buffer.length === 22 && buffer[0] === OPS.OP_0 && buffer[1] === 0x14
}
check.toJSON = function () {
  return 'Witness pubKeyHash output'
}

function encode(pubKeyHash: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  typeGuard(isHash160bit, pubKeyHash)

  return bscript.compile([OPS.OP_0, pubKeyHash])
}
//TODO:validate decode input
function decode(buffer: Buffer): Buffer<ArrayBufferLike> {
  typeGuard(check, buffer)

  return Buffer.from(buffer.subarray(2))
}

export default {
  check,
  decode,
  encode,
}
