// {pubKey} OP_CHECKSIG
// Buffer number
import type {Stack} from '../../types'

import typeGuard from '../../lib/type-guard'
import {OPS} from '../../opcodes'
import bscript from '../../script'

export function check(script: Stack): script is [Buffer, number] {
  const chunks = bscript.decompile(script)

  return (
    chunks.length === 2 &&
    bscript.isCanonicalPubKey(chunks[0]) &&
    chunks[1] === OPS.OP_CHECKSIG
  )
}
check.toJSON = function (): string {
  return 'pubKey output'
}

function encode(pubKey: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  typeGuard(bscript.isCanonicalPubKey, pubKey)

  return bscript.compile([pubKey, OPS.OP_CHECKSIG])
}

function decode(buffer: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  const chunks = bscript.decompile(buffer)
  typeGuard(check, chunks)

  return chunks[0] as Buffer //this is due to check should show [Buffer, number]
}

export default {
  check,
  decode,
  encode,
}
