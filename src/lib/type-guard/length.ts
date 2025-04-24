import { isBuffer, isHex } from './buffer';
import { isArray, isString } from './native';
import { getCallerName } from './util';





function LengthN<T extends {length: number}>(
  type: (value: unknown) => boolean,
  length: number,
  fnName?: string, // add optional callerName params
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
    const callerName = getCallerName()
    const callerPrefix = fnName
      ? `${fnName}: ` //use fnName provided as an override
      : callerName //try to use function used to call the event
        ? `${callerName}: `
        : ''

    throw new Error(
      `${callerPrefix}${name}(Length: ${length}) expected, but got ${name}(Length: ${(value as T)?.length})`,
    )
  }
  Length.toJSON = function (): string {
    return name
  }

  return Length
}

export const ArrayN = LengthN.bind(null, isArray)
export const BufferN = LengthN.bind(null, isBuffer)
export const Hexn = LengthN.bind(null, isHex)
export const StringN = LengthN.bind(null, isString)