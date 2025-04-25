import {varuint} from './lib'
import typeGuard, {
  isBigInt,
  isBuffer,
  isNumber,
  isUInt32,
} from './lib/type-guard'

// https://github.com/feross/buffer/blob/master/index.js#L1127
// function verifuint(value, max) {
//   if (typeof value !== 'number')
//     throw new Error('cannot write a non-number as a number')
//   if (value < 0)
//     throw new Error('specified a negative value for writing an unsigned value')
//   if (value > max) throw new Error('RangeError: value out of range')
//   if (Math.floor(value) !== value)
//     throw new Error('value has a fractional component')
// }
function readUInt64LE(buffer: Buffer, offset: number = 0): number {
  const a = buffer.readUInt32LE(offset)
  let b = buffer.readUInt32LE(offset + 4)
  b *= 0x100000000
  verifuint(b + a, 0x001fffffffffffff)
  return b + a
}
function writeUInt64LE(
  buffer: Buffer,
  value: number | bigint,
  offset: number = 0,
): number {
  verifuint(value, 0x001fffffffffffff)
  buffer.writeInt32LE(Number(value) & -1, offset)
  buffer.writeUInt32LE(Math.floor(Number(value) / 0x100000000), offset + 4)
  return offset + 8
}

const MAX_JS_NUMBER = 0x001fffffffffffff
// https://github.com/feross/buffer/blob/master/index.js#L1127
function verifuint(value: number | bigint, max: number | bigint): void {
  if (!isNumber(value) && !isBigInt(value))
    throw new Error('cannot write a non-number as a number')
  if (value < 0 && value < BigInt(0))
    throw new Error('specified a negative value for writing an unsigned value')
  if (value > max && value > BigInt(max))
    throw new Error('RangeError: value out of range')
  if (Math.floor(Number(value)) !== Number(value))
    throw new Error('value has a fractional component')
}

/**
 * Reverses the order of bytes in a buffer.
 * @param buffer - The buffer to reverse.
 * @returns A new buffer with the bytes reversed.
 */
export function reverseBuffer(buffer: Buffer): Buffer {
  if (buffer.length < 1) return buffer
  let j = buffer.length - 1
  let tmp = 0
  for (let i = 0; i < buffer.length / 2; i++) {
    tmp = buffer[i]
    buffer[i] = buffer[j]
    buffer[j] = tmp
    j--
  }
  return buffer
}

/**
 * Helper class for serialization of bitcoin data types into a pre-allocated buffer.
 */

export class BufferWriter {
  static withCapacity(size: number): BufferWriter {
    return new BufferWriter(Buffer.from(new Uint8Array(size)))
  }
  constructor(
    public buffer: Buffer,
    public offset: number = 0,
  ) {
    typeGuard([isBuffer, isUInt32], [buffer, offset])
  }
  writeUInt8(i: number): void {
    this.offset = this.buffer.writeUInt8(i, this.offset)
  }
  writeUInt16(i: number): void {
    this.offset = this.buffer.writeUint16LE(i, this.offset)
  }
  writeInt32(i: number): void {
    this.offset = this.buffer.writeInt32LE(i, this.offset)
  }
  writeUInt32(i: number): void {
    this.offset = this.buffer.writeUInt32LE(i, this.offset)
  }
  writeInt64(i: number): void {
    this.offset = this.buffer.writeBigInt64LE(BigInt(i), this.offset)
  }
  writeUInt64(i: bigint | number): void {
    this.offset = this.buffer.writeBigUint64LE(BigInt(i), this.offset)
  }
  writeVarInt(i: number): void {
    const {bytes} = varuint.encode(i, this.buffer, this.offset)
    this.offset += bytes
  }
  writeSlice(slice: Buffer): void {
    if (this.buffer.length < this.offset + slice.length) {
      throw new Error('Cannot write slice out of bounds')
    }
    this.offset += slice.copy(this.buffer, this.offset)
  }
  writeVarSlice(slice: Buffer): void {
    this.writeVarInt(slice.length)
    this.writeSlice(slice)
  }
  writeVector(vector: Buffer[]): void {
    this.writeVarInt(vector.length)
    vector.forEach(buf => this.writeVarSlice(buf))
  }
  end(): Buffer {
    if (this.buffer.length === this.offset) {
      return this.buffer
    }
    throw new Error(`buffer size ${this.buffer.length}, offset ${this.offset}`)
  }
}

/**
 * Helper class for reading of bitcoin data types from a buffer.
 */
export class BufferReader {
  constructor(
    public buffer: Buffer,
    public offset: number = 0,
  ) {
    typeGuard([isBuffer, isUInt32], [buffer, offset])
  }

  readUInt8(): number {
    const result = this.buffer.readUInt8(this.offset)
    this.offset++
    return result
  }
  readInt32(): number {
    const result = this.buffer.readInt32LE(this.offset)
    this.offset += 4
    return result
  }
  readUInt32(): number {
    const result = this.buffer.readUInt32LE(this.offset)
    this.offset += 4
    return result
  }
  readUInt64(): bigint {
    const result = this.buffer.readBigInt64LE(this.offset)
    this.offset += 8
    return result
  }
  readVarInt(): bigint {
    const {bigintValue, bytes} = varuint.decode(this.buffer, this.offset)
    this.offset += bytes
    return bigintValue
  }
  readSlice(n: number | bigint): Buffer {
    verifuint(n, MAX_JS_NUMBER)
    const num = Number(n)
    if (this.buffer.length < this.offset + num) {
      throw new Error('Cannot read slice out of bounds')
    }
    const result = this.buffer.subarray(this.offset, this.offset + num)
    this.offset += num
    return result
  }
  readVarSlice(): Buffer {
    return this.readSlice(this.readVarInt())
  }
  readVector(): Buffer[] {
    const count = this.readVarInt()
    const vector: Buffer[] = []
    for (let i = 0; i < count; i++) vector.push(this.readVarSlice())
    return vector
  }
}

export default {
  readUInt64LE, //not sure if truly needed
  writeUInt64LE, //not sure if truly needed
  reverseBuffer,
  BufferWriter,
  BufferReader,
}
