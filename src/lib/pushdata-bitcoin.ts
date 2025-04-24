import {OPS} from '../opcodes'

function encodingLength(i: number): 1 | 2 | 3 | 5 {
  return i < OPS.OP_PUSHDATA1 ? 1 : i <= 0xff ? 2 : i <= 0xffff ? 3 : 5
}

function encode(
  buffer: Buffer,
  number: number,
  offset: number = 0,
): 1 | 2 | 3 | 5 {
  const size = encodingLength(number)

  // ~6 bit
  if (size === 1) {
    buffer.writeUInt8(number, offset)

    // 8 bit
  } else if (size === 2) {
    buffer.writeUInt8(OPS.OP_PUSHDATA1, offset)
    buffer.writeUInt8(number, offset + 1)

    // 16 bit
  } else if (size === 3) {
    buffer.writeUInt8(OPS.OP_PUSHDATA2, offset)
    buffer.writeUInt16LE(number, offset + 1)

    // 32 bit
  } else {
    buffer.writeUInt8(OPS.OP_PUSHDATA4, offset)
    buffer.writeUInt32LE(number, offset + 1)
  }

  return size
}

function decode(
  buffer: Buffer,
  offset: number = 0,
): {
  opcode: number
  number: number
  size: 1 | 2 | 3 | 5
} | null {
  const opcode = buffer.readUInt8(offset)
  let number: number, size: 1 | 2 | 3 | 5

  // ~6 bit
  if (opcode < OPS.OP_PUSHDATA1) {
    number = opcode
    size = 1

    // 8 bit
  } else if (opcode === OPS.OP_PUSHDATA1) {
    if (offset + 2 > buffer.length) return null
    number = buffer.readUInt8(offset + 1)
    size = 2

    // 16 bit
  } else if (opcode === OPS.OP_PUSHDATA2) {
    if (offset + 3 > buffer.length) return null
    number = buffer.readUInt16LE(offset + 1)
    size = 3

    // 32 bit
  } else {
    if (offset + 5 > buffer.length) return null
    if (opcode !== OPS.OP_PUSHDATA4) throw new Error('Unexpected opcode')

    number = buffer.readUInt32LE(offset + 1)
    size = 5
  }

  return {
    opcode: opcode,
    number: number,
    size: size,
  }
}

export default {
  encodingLength,
  encode,
  decode,
}
