// {signature} {pubKey}
// {Buffer} {Buffer}

import type {Stack} from '../../types'

import typeGuard from '../../lib/type-guard'
import bscript from '../../script'

function isCompressedCanonicalPubKey(pubKey: unknown): pubKey is Buffer {
  return bscript.isCanonicalPubKey(pubKey) && pubKey.length === 33
}

//Validates as [Buffer, Buffer]
export function check(script: Buffer | Stack): boolean {
  const chunks = bscript.decompile(script)

  return (
    chunks.length === 2 &&
    bscript.isCanonicalSignature(chunks[0]) &&
    isCompressedCanonicalPubKey(chunks[1])
  )
}
check.toJSON = function (): string {
  return 'witnessPubKeyHash input'
}

function encodeStack(
  signature: Buffer<ArrayBufferLike>,
  pubKey: Buffer<ArrayBufferLike>,
): Buffer<ArrayBufferLike>[] {
  typeGuard(
    [bscript.isCanonicalSignature, isCompressedCanonicalPubKey],
    [signature, pubKey],
  )

  return [signature, pubKey]
}

function decodeStack(stack: Buffer[]): {
  signature: Buffer<ArrayBufferLike>
  pubKey: Buffer<ArrayBufferLike>
} {
  typeGuard(check, stack)

  return {
    signature: stack[0],
    pubKey: stack[1],
  }
}

export default {
  check,
  decodeStack,
  encodeStack,
}
