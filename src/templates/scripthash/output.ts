// OP_HASH160 {scriptHash} OP_EQUAL
// [number, Buffer, number]
import type {Stack} from '../../types'

import typeGuard from '../../lib/type-guard'
import {isHash160bit} from '../../lib/type-guard/buffer'
import {OPS} from '../../opcodes'
import bscript from '../../script'

export function check(script: Buffer | Stack): boolean {
  const buffer = bscript.compile(script)

  return (
    buffer.length === 23 &&
    buffer[0] === OPS.OP_HASH160 &&
    buffer[1] === 0x14 &&
    buffer[22] === OPS.OP_EQUAL
  )
}
check.toJSON = function (): string {
  return 'scriptHash output'
}

function encode(scriptHash: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  typeGuard(isHash160bit, scriptHash)

  return bscript.compile([OPS.OP_HASH160, scriptHash, OPS.OP_EQUAL])
}

//??stack or Buffer
function decode(buffer: Stack): Buffer<ArrayBufferLike> {
  typeGuard(check, buffer)

  return Buffer.from(buffer.slice(2, 22) as number[]) as Buffer //this is base on check returning a [number, Buffer, number] arrangement
}

export default {
  check,
  decode,
  encode,
}
