// {signature} {pubKey}
// Buffer Buffer
import type {Stack} from '../../types'

import typeGuard from '../../lib/type-guard'
import bscript from '../../script'

export function check(script: Buffer | Stack): script is [Buffer, Buffer] {
  const chunks = bscript.decompile(script)

  return (
    chunks.length === 2 &&
    bscript.isCanonicalSignature(chunks[0]) &&
    bscript.isCanonicalPubKey(chunks[1])
  )
}
check.toJSON = function (): string {
  return 'pubKeyHash input'
}

function encodeStack(
  signature: Buffer<ArrayBufferLike>,
  pubKey: Buffer<ArrayBufferLike>,
): Buffer<ArrayBufferLike>[] {
  typeGuard(
    [bscript.isCanonicalSignature, bscript.isCanonicalPubKey],
    [signature, pubKey],
  )

  return [signature, pubKey]
}

function encode(
  signature: Buffer<ArrayBufferLike>,
  pubKey: Buffer<ArrayBufferLike>,
): Buffer<ArrayBufferLike> {
  return bscript.compile(encodeStack(signature, pubKey))
}

function decodeStack(stack: Stack): {
  signature: Buffer<ArrayBufferLike>
  pubKey: Buffer<ArrayBufferLike>
} {
  typeGuard(check, stack)

  //based on check should return [Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>]
  return {
    signature: stack[0] as Buffer<ArrayBufferLike>,
    pubKey: stack[1] as Buffer<ArrayBufferLike>,
  }
}

function decode(buffer: Buffer<ArrayBufferLike>): {
  signature: Buffer<ArrayBufferLike>
  pubKey: Buffer<ArrayBufferLike>
} {
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
