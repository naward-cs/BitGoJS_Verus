// OP_DUP OP_HASH160 {pubKeyHash} OP_EQUALVERIFY OP_CHECKSIG
import type {Stack} from '../../types'

import typeGuard, {isHash160bit} from '../../lib/type-guard'
import {OPS} from '../../opcodes'
import bscript from '../../script'

export function check(script: Buffer| Stack): script is Stack {
  const buffer = bscript.compile(script) //??DO WE NEED THIS

  return (
    buffer.length === 25 &&
    buffer[0] === OPS.OP_DUP &&
    buffer[1] === OPS.OP_HASH160 &&
    buffer[2] === 0x14 &&
    buffer[23] === OPS.OP_EQUALVERIFY &&
    buffer[24] === OPS.OP_CHECKSIG
  )
}
check.toJSON = function () {
  return 'pubKeyHash output'
}

function encode(pubKeyHash: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  typeGuard(isHash160bit, pubKeyHash)

  return bscript.compile([
    OPS.OP_DUP,
    OPS.OP_HASH160,
    pubKeyHash,
    OPS.OP_EQUALVERIFY,
    OPS.OP_CHECKSIG,
  ])
}

//?? is this actually Buffer or Stack
function decode(stack: Stack): Buffer<ArrayBufferLike> {
  typeGuard(check, stack)

  return Buffer.from(stack.slice(3, 23) as number[])
}

export default {
  check,
  decode,
  encode,
}
