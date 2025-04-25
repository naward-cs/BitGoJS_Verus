import type {Stack} from './types'

import * as bip66 from 'bip66'

import pushdata from './lib/pushdata-bitcoin' //todo may need to just bring it in
import typeGuard, {
  isArray,
  isBuffer,
  isHex,
  isNumber,
  isString,
} from './lib/type-guard'
import {OP_INT_BASE, OPS, REVERSE_OPS} from './opcodes'
import scriptNumber from './script_number' //TODO convert

function isOPInt(value: unknown): value is number {
  return (
    isNumber(value) &&
    (value === OPS.OP_0 ||
      (value >= OPS.OP_1 && value <= OPS.OP_16) ||
      value === OPS.OP_1NEGATE)
  )
}

function isPushOnlyChunk(value: unknown): value is number | Buffer {
  return isBuffer(value) || isOPInt(value)
}
/**
 *
 * @param value is looking for an array of something
 * @returns an array containing numbers or Buffer, however, does not specify order of things
 * for example, return could be [number, number, buffer, number] or [number, ...buffer[]]
 */
function isPushOnly(
  value: unknown[],
): value is (number | Buffer<ArrayBufferLike>)[] {
  return isArray(value) && value.every(isPushOnlyChunk)
}

function asMinimalOP(buffer: Buffer): number | undefined {
  if (buffer.length === 0) return OPS.OP_0
  if (buffer.length !== 1) return undefined
  if (buffer[0] >= 1 && buffer[0] <= 16) return OP_INT_BASE + buffer[0]
  if (buffer[0] === 0x81) return OPS.OP_1NEGATE
}

/**
 * Compiles an array of script chunks into a Buffer.
 *
 * @param chunks - The chunks to compile.
 * @returns The compiled script as a Buffer.
 * @throws Error if compilation fails.
 */
//TODO:validate
export function compile(chunks: Buffer | Stack): Buffer<ArrayBufferLike> {
  // TODO: remove me ??why is this a remove me
  if (isBuffer(chunks)) return chunks

  typeGuard(isArray, chunks)

  const bufferSize = chunks.reduce((accum: number, chunk): number => {
    // data chunk
    if (Buffer.isBuffer(chunk)) {
      // adhere to BIP62.3, minimal push policy
      if (chunk.length === 1 && asMinimalOP(chunk) !== undefined) {
        return accum + 1
      }

      return accum + pushdata.encodingLength(chunk.length) + chunk.length
    }

    // opcode
    return accum + 1
  }, 0.0)

  const buffer = Buffer.allocUnsafe(bufferSize)
  let offset = 0

  chunks.forEach(function (chunk) {
    // data chunk
    if (Buffer.isBuffer(chunk)) {
      // adhere to BIP62.3, minimal push policy
      const opcode = asMinimalOP(chunk)
      if (opcode !== undefined) {
        buffer.writeUInt8(opcode, offset)
        offset += 1
        return
      }

      offset += pushdata.encode(buffer, chunk.length, offset)
      chunk.copy(buffer, offset)
      offset += chunk.length

      // opcode
    } else {
      buffer.writeUInt8(chunk, offset)
      offset += 1
    }
  })

  if (offset !== buffer.length) throw new Error('Could not decode chunks')
  return buffer
}

/**
 * Decompiles a script buffer into an array of chunks.
 *
 * @param buffer - The script buffer to decompile.
 * @returns The decompiled chunks or null if decompilation fails.
 */
export function decompile(buffer: Buffer | Stack): Stack {
  // TODO: remove me ??why
  if (isArray(buffer)) return buffer
  typeGuard(isBuffer, buffer)

  const chunks: Stack = []
  let i = 0

  while (i < buffer.length) {
    const opcode = buffer[i]

    // data chunk
    if (opcode > OPS.OP_0 && opcode <= OPS.OP_PUSHDATA4) {
      const d = pushdata.decode(buffer, i)

      // did reading a pushDataInt fail? empty script
      if (d === null) return []
      i += d.size

      // attempt to read too much data? empty script
      if (i + d.number > buffer.length) return []

      // Buffer.from to support platforms without full buffer implementations
      const data = Buffer.from(buffer.slice(i, i + d.number))
      i += d.number

      // decompile minimally
      const op = asMinimalOP(data)
      if (op !== undefined) {
        chunks.push(op)
      } else {
        chunks.push(data)
      }

      // opcode
    } else {
      chunks.push(opcode)

      i += 1
    }
  }

  return chunks
}

/**
 * Converts the given chunks into an ASM (Assembly) string representation.
 * If the chunks parameter is a Buffer, it will be decompiled into a Stack before conversion.
 * @param chunks - The chunks to convert into ASM.
 * @returns The ASM string representation of the chunks.
 */
export function toASM(chunks: Buffer | Stack): string {
  if (Buffer.isBuffer(chunks)) {
    chunks = decompile(chunks)
  }

  return chunks
    .map(function (chunk): string {
      // data?
      if (Buffer.isBuffer(chunk)) {
        const op = asMinimalOP(chunk)
        if (op === undefined) return chunk.toString('hex')
        chunk = op
      }

      // opcode!
      return REVERSE_OPS[chunk]
    })
    .join(' ')
}

/**
 * Converts an ASM string to a Buffer.
 * @param asm The ASM string to convert.
 * @returns The converted Buffer.
 */
export function fromASM(asm: string): Buffer<ArrayBufferLike> {
  typeGuard(isString, asm)

  return compile(
    asm.split(' ').map(function (chunkStr) {
      // opcode?
      if (OPS[chunkStr] !== undefined) return OPS[chunkStr]
      typeGuard(isHex, chunkStr)

      // data!
      return Buffer.from(chunkStr, 'hex')
    }),
  )
}

/**
 * Converts the given chunks into a stack of buffers.
 *
 * @param chunks - The chunks to convert.
 * @returns The stack of buffers.
 */
//TODO is toStack chunks Buffer??? or Stack??
export function toStack(chunks: Buffer | Stack): Buffer<ArrayBufferLike>[] {
  if (isBuffer(chunks)) {
    chunks = decompile(chunks)
  }
  //?? maybe create a check to compare if chunks is a stack or buffer
  // const newChunks = decompile(chunks)
  typeGuard(isPushOnly, chunks)

  return chunks.map(function (op): Buffer<ArrayBufferLike> {
    if (Buffer.isBuffer(op)) return op
    if (op === OPS.OP_0) return Buffer.allocUnsafe(0)

    return scriptNumber.encode(op - OP_INT_BASE)
  })
}

export function isCanonicalPubKey(buffer: unknown): buffer is Buffer {
  if (!Buffer.isBuffer(buffer)) return false
  if (buffer.length < 33) return false

  switch (buffer[0]) {
    case 0x02:
    case 0x03:
      return buffer.length === 33
    case 0x04:
      return buffer.length === 65
  }

  return false
}

export function isDefinedHashType(hashType: number): boolean {
  const hashTypeMod = hashType & ~0xc0

  // return hashTypeMod > SIGHASH_ALL && hashTypeMod < SIGHASH_SINGLE
  return hashTypeMod > 0x00 && hashTypeMod < 0x04
}

function isCanonicalSignature(buffer: unknown): buffer is Buffer {
  if (!Buffer.isBuffer(buffer)) return false
  if (!isDefinedHashType(buffer[buffer.length - 1])) return false

  return bip66.check(buffer.subarray(0, -1))
}

export default {
  compile,
  decompile,
  fromASM,
  toASM,
  toStack,

  number: scriptNumber,

  isCanonicalPubKey,
  isCanonicalSignature,
  isPushOnly,
  isDefinedHashType,
}
