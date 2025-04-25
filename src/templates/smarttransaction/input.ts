// OP_0 [signatures ...]
// number [...buffer[]]
import type {Stack} from '../../types'

import typeGuard from '../../lib/type-guard'
import {OPS} from '../../opcodes'
import bscript from '../../script'

const SmartTransactionSignatures = require('../../smart_transaction_signatures')

function partialSignature(value: unknown): value is number | Buffer {
  return value === OPS.OP_0 || bscript.isCanonicalSignature(value)
}

export function check(script: Buffer | Stack): boolean {
  const chunks = bscript.decompile(script)
  if (chunks.length !== 1) return false

  return SmartTransactionSignatures.fromChunk(chunks[0]).isValid()
}
check.toJSON = function (): string {
  return 'smart transaction input'
}

function encodeStack(
  signature: Buffer<ArrayBufferLike>,
): Buffer<ArrayBufferLike>[] {
  const smartTxSigs = SmartTransactionSignatures.fromChunk(signature)

  if (smartTxSigs.error == null) return [signature]
  else throw smartTxSigs.error
}

function encode(
  // signatures: Buffer<ArrayBufferLike>[],
  scriptPubKey: Buffer<ArrayBufferLike>,
): Buffer<ArrayBufferLike> {
  // return bscript.compile(encodeStack(signatures, scriptPubKey))
  // return bscript.compile(encodeStack(signatures))
  return bscript.compile(encodeStack(scriptPubKey))
}

function decodeStack(
  stack: Stack,
  allowIncomplete?: boolean,
): Buffer<ArrayBufferLike>[] {
  typeGuard(check, stack, allowIncomplete)
  return stack.slice(1) as Buffer[]
}

function decode(
  buffer: Buffer<ArrayBufferLike>,
  allowIncomplete?: boolean,
): Buffer<ArrayBufferLike>[] {
  const stack = bscript.decompile(buffer)
  return decodeStack(stack, allowIncomplete)
}

export default {
  check,
  decode,
  decodeStack,
  encode,
  encodeStack,
  partialSignature,
}
