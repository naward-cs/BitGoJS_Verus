/* eslint-disable @typescript-eslint/no-explicit-any */
import type {ObjectSchema, ValidFn} from '../../types/types-guard'

import {isArray} from './native'
import {getCallerName} from './util'

function isValid<K>(
  validFn: ValidFn<K>,
  arg: unknown,
  strict?: boolean,
): boolean

function isValid<T extends any[]>(
  validFns: ValidFn<T[number]>[],
  args: T,
  strict?: boolean,
): boolean

function isValid<K, T extends any[]>(
  fn: ValidFn<K> | ValidFn<T[number]>[],
  argsOrArgs: unknown | T,
  strict?: boolean,
): boolean {
  try {
    if (typeof fn === 'function') {
      if (strict) return fn(argsOrArgs, strict)
      return fn(argsOrArgs)
    } else if (isArray(fn) && isArray(argsOrArgs)) {
      if (fn.length !== argsOrArgs.length) {
        console.error(
          `Number of Validators ${fn.length} does not match number of args ${argsOrArgs.length} to validate`,
        )
        return false
      }
      return fn.every((valididator, i) =>
        strict
          ? valididator(argsOrArgs[i], strict)
          : valididator(argsOrArgs[i]),
      )
    } else {
      return false
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

function isValidateProp<K extends keyof T, T>(
  obj: Partial<T>,
  propertyName: K,
  validator: ValidFn<T[K]>,
): boolean {
  return validator(obj[propertyName])
}

function isValidObject<T>(schema: ObjectSchema<T>, obj: Partial<T>): boolean {
  for (const key in schema) {
    if (!isValidateProp(obj, key, schema[key])) {
      return false // Return false if any property fails
    }
  }
  return false
}

export {isValid, isValidateProp, isValidObject}

// type Person = {
//   name?: string
//   age: number
// }
// const person1: Partial<Person> = { name: 'Alice' };
// const person2: Partial<Person> = {age: 30}
// const person3: Partial<Person> = {name: 123}
// const person4: Partial<Person> = {age: 'test'}

// console.log(validateProperty(person1, 'name', maybe(isString))) // true
// console.log(validateProperty(person2, 'age', isNumber)) // true
// console.log(validateProperty(person3, 'name', maybe(isString))) // false
// console.log(validateProperty(person4, 'age', isNumber)) // false
