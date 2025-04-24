import type {ValidFn} from './valid'

import {isNumber} from './native'

export function isFinite(value: unknown): value is number {
  return Number.isFinite(value)
}
export function isInteger(value: unknown): value is number {
  return Number.isInteger(value)
}

export function isUInteger(value: unknown): value is number {
  return isInteger(value) && value >= 0
}

export function isInt8(value: unknown): value is number {
  return isInteger(value) && (value << 24) >> 24 === value
}

export function isInt16(value: unknown): value is number {
  return isInteger(value) && (value << 16) >> 16 === value
}

export function isInt32(value: unknown): value is number {
  return isInteger(value) && (value | 0) === value
}

const INT53_MAX = Math.pow(2, 53) - 1
export function isInt53(value: unknown): value is number {
  return (
    isInteger(value) &&
    value >= 0 &&
    value <= INT53_MAX &&
    Math.floor(value) === value
  )
}

export function isUInt8(value: unknown): value is number {
  return isUInteger(value) && (value & 0xff) === value
}

export function isUInt16(value: unknown): value is number {
  return isUInteger(value) && (value & 0xffff) === value
}

const UINT31_MAX = Math.pow(2, 31) - 1
export function isUInt31(value: unknown): value is number {
  return isUInteger(value) && isUInt32(value) && value <= UINT31_MAX
}

export function isUInt32(value: unknown): value is number {
  return isUInteger(value) && value >>> 0 === value
}

export function isUInt53(value: unknown): value is number {
  return (
    isUInteger(value) &&
    value >= 0 &&
    value <= INT53_MAX &&
    Math.floor(value) === value
  )
}

export function range(a: number, b: number, fn: ValidFn = isNumber): void {
  function _range(value: unknown, strict?: boolean): boolean {
    if (strict) {
      return isFinite(value) && fn(value) && value > a && value < b
    }
    return isNumber(value) && fn(value) && value > a && value < b
  }
  _range.toJSON = function (): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `${(fn as any).toJSON ? (fn as any).toJSON() : fn.name || 'anonymous function'} between [${a}, ${b}]`
  }
}
