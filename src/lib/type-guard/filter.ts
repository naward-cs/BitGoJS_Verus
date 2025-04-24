import type {ObjectSchema, ValidFn} from '../../types/types-guard'

import {isValid} from './valid'

/**
 * oneOf explicitly only allows one validation to be true
 * if wanting can be any oneOf, use anyOf
 * @param fns an array of (value:unknown)=>boolean functions
 * @param value a value to use to check if oneOf
 * @returns true only if returns true for only one valid fns
 */
function oneOf<T>(...fns: ValidFn<T>[]): ValidFn<T> {
  return (value: unknown): value is T => {
    const passingValidations = fns.filter(fn => fn(value))
    return passingValidations.length === 1
  }
}

function anyOf<T>(...fns: ValidFn<T>[]): ValidFn<T> {
  return (value: unknown): value is T => {
    return fns.some(fn => {
      try {
        fn(value)
      } catch {
        return false
      }
    })
  }
}

function allOf<T>(fns: ValidFn<T>[], value: unknown): boolean {
  return fns.every(fn => {
    try {
      fn(value)
    } catch {
      return false
    }
  })
}

function maybe<T>(
  fnOrSchema: ValidFn<T> | ObjectSchema<T>,
): ValidFn<T | undefined> {
  return (value: unknown, strict?: boolean): value is T | undefined => {
    if (value === null || value === undefined) {
      return true
    }

    if (typeof fnOrSchema === 'function') {
      return isValid(fnOrSchema, value, strict)
    } else if (typeof fnOrSchema === 'object' && fnOrSchema !== null) {
      if (typeof value !== 'object' || value === null) {
        return false
      }
      for (const key in fnOrSchema) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!isValid(fnOrSchema[key], (value as any)[key], strict)) {
          return false
        }
      }
      return true
    } else {
      return false
    }
  }
}

export {allOf, anyOf, maybe, oneOf}
