// <scriptSig> {serialized scriptPubKey script}
// Buffer {unknown Buffer ??Buffer} => Buffer[]
import type {Stack} from '../../types'

import typeGuard, {isArray, isBuffer} from '../../lib/type-guard'
import bscript from '../../script'
import p2ms from '../multisig/'
import p2pk from '../pubkey/'
import p2pkh from '../pubkeyhash/'

export function check(chunks: Stack, allowIncomplete?: boolean): boolean {
  typeGuard(isArray, chunks)
  if (chunks.length < 1) return false

  const witnessScript = chunks[chunks.length - 1]
  if (!Buffer.isBuffer(witnessScript)) return false

  const witnessScriptChunks = bscript.decompile(witnessScript)

  // is witnessScript a valid script?
  if (witnessScriptChunks.length === 0) return false

  const witnessRawScriptSig = bscript.compile(chunks.slice(0, -1))

  // match types
  if (
    p2pkh.input.check(witnessRawScriptSig) &&
    p2pkh.output.check(witnessScriptChunks)
  )
    return true

  if (
    p2ms.input.check(witnessRawScriptSig, allowIncomplete) &&
    p2ms.output.check(witnessScriptChunks)
  )
    return true

  if (
    p2pk.input.check(witnessRawScriptSig) &&
    p2pk.output.check(witnessScriptChunks)
  )
    return true

  return false
}
check.toJSON = function () {
  return 'witnessScriptHash input'
}

function encodeStack(witnessData: Buffer[], witnessScript: Buffer): Buffer[] {
  typeGuard(isArray, witnessData)
  witnessData.every(w => typeGuard(isBuffer, w))

  typeGuard(isBuffer, witnessScript)

  return ([] as Buffer[]).concat(witnessData, witnessScript)
}

function decodeStack(chunks: Buffer[]): {
  witnessData: Buffer<ArrayBufferLike>[]
  witnessScript: Buffer<ArrayBufferLike>
} {
  typeGuard(check, chunks)
  return {
    witnessData: chunks.slice(0, -1),
    witnessScript: chunks[chunks.length - 1],
  }
}

export default {
  check,
  decodeStack,
  encodeStack,
}
