// OP_0 [signatures ...]
// [number, ...Buffer[]]

import type {Stack} from '../../types'

import typeGuard from '../../lib/type-guard'
import {OPS} from '../../opcodes'
import bscript from '../../script'
import p2mso from './output'

function partialSignature(value: unknown): value is number | Buffer {
  return value === OPS.OP_0 || bscript.isCanonicalSignature(value)
}

export function check(
  script: Buffer | Stack,
  allowIncomplete?: boolean,
): boolean {
  const chunks = bscript.decompile(script)
  if (chunks.length < 2) return false
  if (chunks[0] !== OPS.OP_0) return false

  if (allowIncomplete) {
    return chunks.slice(1).every(partialSignature)
  }

  return chunks.slice(1).every(bscript.isCanonicalSignature)
}
check.toJSON = function () {
  return 'multisig input'
}

const EMPTY_BUFFER = Buffer.allocUnsafe(0)

function encodeStack(
  signatures: [OPS.OP_0, ...Buffer[]],
  scriptPubKey?: Buffer,
): Buffer<ArrayBufferLike>[] {
  signatures.every(s => typeGuard(partialSignature, s))

  if (scriptPubKey) {
    const scriptData = p2mso.decode(scriptPubKey)

    if (signatures.length < scriptData.m) {
      throw new TypeError('Not enough signatures provided')
    }

    if (signatures.length > scriptData.pubKeys.length) {
      throw new TypeError('Too many signatures provided')
    }
  }

  return ([] as Buffer[]).concat(
    EMPTY_BUFFER,
    signatures.map(function (sig): Buffer {
      if (sig === OPS.OP_0) {
        return EMPTY_BUFFER
      }
      return sig
    }),
  )
}

function encode(
  signatures: [OPS.OP_0, ...Buffer[]],
  scriptPubKey?: Buffer,
): Buffer<ArrayBufferLike> {
  return bscript.compile(encodeStack(signatures, scriptPubKey))
}

function decodeStack(stack: Stack, allowIncomplete?: boolean): Buffer[] {
  typeGuard(check, stack, allowIncomplete)
  return stack.slice(1) as Buffer[]
}

function decode(buffer: Buffer, allowIncomplete?: boolean): Buffer[] {
  const stack = bscript.decompile(buffer)
  return decodeStack(stack, allowIncomplete)
}

export default {
  check,
  decode,
  decodeStack,
  encode,
  encodeStack,
}
