import type {ValidFn} from './valid'

import {isBuffer, isHex} from './buffer'
import {isArray, isString} from './native'

function _LengthN<T extends {length: number}>(
  type: ValidFn,
  length: number,
): {
  (value: unknown): boolean
  toJSON(): string
} {
  const name = type.name

  function Length(value: unknown): boolean {
    if (!type(value)) return false
    // Type guard to ensure 'value' has a 'length' property
    if (
      typeof (value as T).length === 'number' &&
      (value as T).length === length
    ) {
      return true
    }

    throw new Error(
      `${name}(Length: ${length}) expected, but got ${name}(Length: ${(value as T)?.length})`,
    )
  }
  Length.toJSON = function () {
    return name
  }

  return Length
}

export const ArrayN = _LengthN.bind(null, isArray)
export const BufferN = _LengthN.bind(null, isBuffer)
export const Hexn = _LengthN.bind(null, isHex)
export const StringN = _LengthN.bind(null, isString)
