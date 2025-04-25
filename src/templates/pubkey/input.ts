// {signature}
//?? Buffer Object
import type {Stack} from '../../types'

import typeGuard from '../../lib/type-guard'
import bscript from '../../script'

export function check(script: Stack | Buffer): boolean {
  const chunks = bscript.decompile(script)

  return chunks.length === 1 && bscript.isCanonicalSignature(chunks[0])
}
check.toJSON = function (): string {
  return 'pubKey input'
}

function encodeStack(
  signature: Buffer<ArrayBufferLike>,
): Buffer<ArrayBufferLike>[] {
  typeGuard(bscript.isCanonicalSignature, signature)

  return [signature]
}

function encode(signature: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  return bscript.compile(encodeStack(signature))
}

function decodeStack(stack: Stack): Buffer<ArrayBufferLike> {
  typeGuard(check, stack)
  return stack[0] as Buffer<ArrayBufferLike> //check should comeback as [Buffer]
}

function decode(buffer: Buffer<ArrayBufferLike>): Buffer<ArrayBufferLike> {
  const stack = bscript.decompile(buffer)
  return decodeStack(stack)
}

export default {
  check,
  decode,
  decodeStack,
  encode,
  encodeStack,
}
