import type {Triple, Tuple} from '../../types'

import {typeGuard} from './type-guard'

export * from './buffer'
export * from './filter'
export * from './length'
export * from './native'
export * from './numbers'
export * from './type-guard'
export * from './util'
export * from './valid'

export default typeGuard

export function isTuple<T>(arr: T[]): arr is Tuple<T> {
  return arr.length === 2
}

export function isTriple<T>(arr: T[]): arr is Triple<T> {
  return arr.length === 3
}
