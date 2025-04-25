// OP_RETURN {data}
// number {Buffer??}
import type {Stack} from '../types'

import typeGuard, {isArray, isBuffer, oneOf} from '../lib/type-guard'
import {OPS} from '../opcodes'
import bscript from '../script'

export function check(script: Buffer | Stack): boolean {
  const buffer = bscript.compile(script)

  return buffer.length > 1 && buffer[0] === OPS.OP_RETURN
}
check.toJSON = function () {
  return 'null data output'
}

//assuming data is buffer and nothing more
function encode(data: Buffer | Buffer[]): Buffer<ArrayBufferLike> {
  // Allow arrays types since decompile returns an array too
  typeGuard(oneOf(isBuffer, isArray), data)

  return bscript.compile(([OPS.OP_RETURN] as Stack).concat(data))
}

function decode(buffer: Buffer): Buffer | Buffer[] {
  typeGuard(check, buffer)

  const chunks = bscript.decompile(buffer)

  chunks.shift()

  return chunks.length === 1 ? (chunks[0] as Buffer) : (chunks as Buffer[])
}

export default {
  output: {
    check,
    decode,
    encode,
  },
}
