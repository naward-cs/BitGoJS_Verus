import type {Stack} from '../../types'

import typeGuard, {isHash256bit} from '../../lib/type-guard'
// OP_RETURN {aa21a9ed} {commitment}
// numbe {?? buffer ?? } {?? buffer ??}

import {OPS} from '../../opcodes'
import bscript from '../../script'

const HEADER = Buffer.from('aa21a9ed', 'hex')

export function check(script: Buffer<ArrayBufferLike> | Stack): boolean {
  const buffer = bscript.compile(script)

  return (
    buffer.length > 37 &&
    buffer[0] === OPS.OP_RETURN &&
    buffer[1] === 0x24 &&
    buffer.subarray(2, 6).equals(HEADER)
  )
}

check.toJSON = function (): string {
  return 'Witness commitment output'
}

function encode(commitment: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  typeGuard(isHash256bit, commitment)

  const buffer = Buffer.allocUnsafe(36)
  HEADER.copy(buffer, 0)
  commitment.copy(buffer, 4)

  return bscript.compile([OPS.OP_RETURN, buffer])
}

function decode(buffer: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  typeGuard(check, buffer)

  return (bscript.decompile(buffer)[1] as Buffer).subarray(4, 36)
}

export default {
  check,
  decode,
  encode,
}
