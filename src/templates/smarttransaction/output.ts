// m [pubKeys ...] n OP_CHECKMULTISIG
// number [...buffer[]] number number
import type {Stack} from '../../types'

import typeGuard, {isArray, isNumber} from '../../lib/type-guard'
import {OP_INT_BASE, OPS} from '../../opcodes'
import bscript from '../../script'

const OptCCParams = require('../../optccparams')

export function check(script: Buffer | Stack): boolean {
  const chunks = bscript.decompile(script)

  // chunks for a smart transaction should include a push of either a CC or empty/master COptCCParams, then an OP_CHECKCRYPTOCONDITION,
  // then a potentially nested COptCCParams
  // we always start by decoding the second COptCCParams first to determine if the first one should be an opaque CC, as it was
  // in earlier versions. if not, it is added to the end of the data objects of the first params
  if (
    chunks.length < 4 ||
    !(
      chunks[chunks.length - 1] === OPS.OP_DROP &&
      chunks[1] === OPS.OP_CHECKCRYPTOCONDITION
    )
  ) {
    return false
  }

  const params = OptCCParams.fromChunk(chunks[2])
  const master = OptCCParams.fromChunk(chunks[0])

  if (!params.isValid() || !master.isValid()) {
    return false
  }

  // now validate eval codes, object presence, currencies, types, etc.

  return true
}
check.toJSON = function (): string {
  return 'smart transaction output'
}

function encode(
  m: number,
  pubKeys: Buffer<ArrayBufferLike>[],
): Buffer<ArrayBufferLike> {
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
): {m: number; pubKeys: Buffer<ArrayBufferLike>[]} {
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
