/* eslint-disable @typescript-eslint/no-explicit-any */
// export type ValidFn<T> =
//   | ((value: unknown) => value is T)
//   | ((value: unknown, strict?: boolean) => value is T)

// export type ValidFn<T> =
//   | ((value: any) =>  boolean)
//   | ((value: any, strict?: boolean) => boolean )

type VFn1<T> = (value: any) => value is T
type VFn2<T> = (value: any, strict?: boolean) => value is T
type VFn3 = (value: any) => boolean
type VFn4 = (value: any, strict?: boolean) => boolean

export type ValidFn<T> = VFn1<T> | VFn2<T> | VFn3 | VFn4

// export type ValidFn<T> =
// | (value: T) => boolean
// | (value: T, strict?: boolean) => boolean

// export type ValidFn = ValidFnWithoutStrict | ValidFnWithStrict

export type ObjectSchema<T> = {[K in keyof T]: ValidFn<T[K]>}
