import {BufferN} from './length'
import {isString} from './native'

export function isBuffer(value: unknown): value is Buffer {
  if (typeof Buffer === 'undefined')
    throw new Error('Buffer is required for this environment')

  return Buffer.isBuffer(value)
}

export function isHex(value: unknown): value is string {
  return isString(value) && /^([0-9a-f]{2})+$/i.test(value)
}

export function isBufferArray(value: unknown): value is Buffer[] {
  return Array.isArray(value) && value.every(e => Buffer.isBuffer(e))
}

export function isHash160bit(value: unknown): value is Buffer {
  return BufferN(20, 'isHash160bit')(value)
}

export function isHash256bit(value: unknown): value is Buffer {
  return BufferN(32, 'isHash256bit')(value)
}

export function isBuffer256bit(value: unknown): value is Buffer {
  return BufferN(32, 'isHash256bit')(value)
}

export function isBufferN64(value: unknown): value is Buffer {
  return BufferN(64, 'isBufferN64')(value)
}
