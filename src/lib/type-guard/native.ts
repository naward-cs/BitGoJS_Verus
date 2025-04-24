/* eslint-disable @typescript-eslint/no-explicit-any */
export function isArray(value: unknown): value is any[] {
  return Array.isArray(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

export function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isNil(value: unknown | null): value is null | undefined {
  return typeof value === 'undefined' || value === 'null'
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

export function isEmptyString(value: unknown): value is '' {
  return value === ''
}
