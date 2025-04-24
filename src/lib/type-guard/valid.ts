import {isArray} from './native'

type ValidFnWithoutStrict = (value: any) => boolean
type ValidFnWithStrict = (value: any, strict?: boolean) => boolean

export type ValidFn = ValidFnWithoutStrict | ValidFnWithStrict

function isValid(validFn: ValidFn, arg: unknown, strict?: boolean): boolean

function isValid<T extends any[]>(
  validFns: ValidFn[],
  args: T,
  strict?: boolean,
): boolean

function isValid<T extends any[]>(
  fn: ValidFn | ValidFn[],
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
    throw new Error(`Validation error in ${fnNames}: ${error.message || error}`)
    // console.error(`Validation error in ${fnNames}`, error.meesage || error)
    // return false
  }
}

function oneOf(fns: ValidFn[], value: unknown): boolean {
  const passingValidations = fns.filter(fn => fn(value))
  return passingValidations.length === 1
}

// function anyOf(fns: ValidFn[], value: unknown): boolean {
//   return fns.some(fn => fn(value))
// }

function anyOf(...fns: ValidFn[]): ValidFn {
  return (value: unknown) => {
    return fns.some(fn => {
      try {
        fn(value)
      } catch (_) {}
    })
  }
}

function allOf(fns: ValidFn[], value: unknown): boolean {
  return fns.every(fn => {
    try {
      fn(value)
    } catch (_) {}
  })
}

export {allOf, anyOf, isValid, oneOf}
