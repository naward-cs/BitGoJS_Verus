export * as bip66 from 'bip66'
export * as varuint from 'varuint-bitcoin'

export function bufferToUint8Array(buffer: Buffer): Uint8Array {
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
}

export {default as pushdata} from './pushdata-bitcoin'
