/* eslint-disable @typescript-eslint/no-explicit-any */
import type {ObjectSchema, ValidFn} from '../../types/types-guard'

import {isArray} from './native'
import {getCallerName} from './util'

function typeGuard<K>(validFn: ValidFn<K>, arg: unknown, strict?: boolean): void

function typeGuard<T extends any[]>(
  validFns: ValidFn<T[number]>[], // ValidFn for each element of T
  args: T,
  strict?: boolean,
): void

function typeGuard<K, T extends any[]>(
  fn: ValidFn<K> | ValidFn<T[number]>[],
  argsOrArgs: unknown | T,
  strict?: boolean,
): void {
  try {
    if (typeof fn === 'function') {
      const r = strict ? fn(argsOrArgs, strict) : fn(argsOrArgs)
      if (!r) throw new TypeError('Validation failed')
      // if (strict) return fn(argsOrArgs, strict)
      // return fn(argsOrArgs)
    } else if (isArray(fn) && isArray(argsOrArgs)) {
      if (fn.length !== argsOrArgs.length) {
        throw new TypeError(
          `Number of Validators ${fn.length} does not match number of args ${argsOrArgs.length} to validate`,
        )
      }
      fn.every((valididator, i) => {
        const r = strict
          ? valididator(argsOrArgs[i], strict)
          : valididator(argsOrArgs[i])
        if (!r) throw new TypeError(`Validation failed at index ${i}`)
      })
    } else {
      throw new TypeError('Invalid validation configuration')
    }
  } catch (error: any) {
    const fnNames = Array.isArray(fn)
      ? fn.map(f => f.name || 'anonymous function').join(', ')
      : fn.name || 'anonymous function'

    // Get caller's name from the stack trace
    const callerName = getCallerName()
    const callerPrefix = callerName ? `${callerName}: ` : ''
    throw new Error(
      `${callerPrefix}Validation error in ${fnNames}: ${error.message || error}`,
    )
    // console.error(`Validation error in ${fnNames}`, error.meesage || error)
    // return false
  }
}

function typeGuardProp<K extends keyof T, T>(
  obj: Partial<T>,
  propertyName: K,
  validator: ValidFn<T[K]>,
): void {
  typeGuard(validator, obj[propertyName])
}

function typeGuardObject<T>(schema: ObjectSchema<T>, obj: Partial<T>):void {
  for (const key in schema) {
    typeGuard(schema[key], obj[key])
  }
}

export {typeGuard, typeGuardObject, typeGuardProp}
