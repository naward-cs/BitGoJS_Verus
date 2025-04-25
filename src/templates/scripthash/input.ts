// <scriptSig> {serialized scriptPubKey script}

import type {Stack} from '../../types'

import typeGuard from '../../lib/type-guard'
import bscript from '../../script'
import p2ms from '../multisig/'
import p2pk from '../pubkey/'
import p2pkh from '../pubkeyhash/'
import p2wpkho from '../witnesspubkeyhash/output'
import p2wsho from '../witnessscripthash/output'

export function check(
  script: Buffer | Stack,
  allowIncomplete?: boolean,
): boolean {
  const chunks = bscript.decompile(script)
  if (chunks.length < 1) return false

  const lastChunk = chunks[chunks.length - 1]
  if (!Buffer.isBuffer(lastChunk)) return false

  const scriptSigChunks = bscript.decompile(
    bscript.compile(chunks.slice(0, -1)),
  )
  const redeemScriptChunks = bscript.decompile(lastChunk)

  // is redeemScript a valid script?
  if (redeemScriptChunks.length === 0) return false

  // is redeemScriptSig push only?
  if (!bscript.isPushOnly(scriptSigChunks)) return false

  // is witness?
  if (chunks.length === 1) {
    return p2wsho.check(redeemScriptChunks) || p2wpkho.check(redeemScriptChunks)
  }

  // match types
  if (
    p2pkh.input.check(scriptSigChunks) &&
    p2pkh.output.check(redeemScriptChunks)
  )
    return true

  if (
    p2ms.input.check(scriptSigChunks, allowIncomplete) &&
    p2ms.output.check(redeemScriptChunks)
  )
    return true

  if (
    p2pk.input.check(scriptSigChunks) &&
    p2pk.output.check(redeemScriptChunks)
  )
    return true

  return false
}
check.toJSON = function (): string {
  return 'scriptHash input'
}

function encodeStack(redeemScriptStack: Stack, redeemScript: Buffer): Stack {
  //??should this be a Buffer[] vice stack
  const serializedScriptPubKey = bscript.compile(redeemScript)

  return ([] as Stack).concat(redeemScriptStack, serializedScriptPubKey)
}

function encode(
  redeemScriptSig: Buffer<ArrayBufferLike>,
  redeemScript: Buffer<ArrayBufferLike>,
): Buffer<ArrayBufferLike> {
  const redeemScriptStack = bscript.decompile(redeemScriptSig)

  return bscript.compile(encodeStack(redeemScriptStack, redeemScript))
}

function decodeStack(stack: Stack): {
  redeemScriptStack: Stack
  redeemScript: Buffer<ArrayBufferLike>
} {
  typeGuard(check, stack)

  return {
    redeemScriptStack: stack.slice(0, -1),
    redeemScript: stack[stack.length - 1] as Buffer,
  }
}

function decode(buffer: Buffer): {
  redeemScript: Buffer<ArrayBufferLike>
  redeemScriptSig: Buffer<ArrayBufferLike>
} {
  const stack = bscript.decompile(buffer)
  const {redeemScriptStack, redeemScript} = decodeStack(stack)
  const redeemScriptSig = bscript.compile(redeemScriptStack)
  // delete result.redeemScriptStack
  return {redeemScript, redeemScriptSig}
}

export default {
  check,
  decode,
  decodeStack,
  encode,
  encodeStack,
}
