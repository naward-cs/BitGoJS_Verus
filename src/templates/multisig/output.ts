// m [pubKeys ...] n OP_CHECKMULTISIG
// [number, ...Buffer[], number, number]
import type {Stack} from '../../types'

import typeGuard, {isArray, isNumber} from '../../lib/type-guard'
import {OP_INT_BASE, OPS} from '../../opcodes'
import bscript from '../../script'

export function check(script: Buffer | Stack, allowIncomplete?: boolean): boolean {
  const chunks = bscript.decompile(script)

  if (chunks.length < 4) return false
  if (chunks[chunks.length - 1] !== OPS.OP_CHECKMULTISIG) return false
  if (!isNumber(chunks[0])) return false
  if (!isNumber(chunks[chunks.length - 2])) return false
  const m = chunks[0] - OP_INT_BASE
  const n = (chunks[chunks.length - 2] as number) - OP_INT_BASE

  if (m <= 0) return false
  if (n > 16) return false
  if (m > n) return false
  if (n !== chunks.length - 3) return false
  if (allowIncomplete) return true

  const keys = chunks.slice(1, -2)
  return keys.every(bscript.isCanonicalPubKey)
}
check.toJSON = function (): string {
  return 'multi-sig output'
}

function encode(m: number, pubKeys: Buffer[]): Buffer<ArrayBufferLike> {
  typeGuard([isNumber, isArray], [m, pubKeys])
  pubKeys.every(p => typeGuard(bscript.isCanonicalPubKey, p))

  const n = pubKeys.length
  if (n < m) throw new TypeError('Not enough pubKeys provided')

  return bscript.compile(
    ([] as Stack).concat(
      OP_INT_BASE + m,
      pubKeys,
      OP_INT_BASE + n,
      OPS.OP_CHECKMULTISIG,
    ),
  )
}

function decode(
  buffer: Buffer<ArrayBufferLike>,
  allowIncomplete?: boolean,
): {
  m: number
  pubKeys: Buffer[]
} {
  const chunks = bscript.decompile(buffer)
  typeGuard(check, chunks, allowIncomplete)

  return {
    m: (chunks[0] as number) - OP_INT_BASE,
    pubKeys: chunks.slice(1, -2) as Buffer[],
  }
}

export default {
  check,
  decode,
  encode,
}
