// OP_0 {scriptHash}
// number {Buffer}
import type {Stack} from '../../types'

import typeGuard, {isHash256bit} from '../../lib/type-guard'
import {OPS} from '../../opcodes'
import bscript from '../../script'

export function check(script: Buffer | Stack): boolean {
  const buffer = bscript.compile(script)

  return buffer.length === 34 && buffer[0] === OPS.OP_0 && buffer[1] === 0x20
}
check.toJSON = function (): string {
  return 'Witness scriptHash output'
}

function encode(scriptHash: Buffer): Buffer<ArrayBufferLike> {
  typeGuard(isHash256bit, scriptHash)

  return bscript.compile([OPS.OP_0, scriptHash])
}

function decode(buffer: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  typeGuard(check, buffer)

  return buffer.subarray(2)
}

export default {
  check,
  decode,
  encode,
}
