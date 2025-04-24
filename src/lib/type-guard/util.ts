import type {ObjectSchema, ValidFn} from '../../types/types-guard'

// Utility function to generate ObjectSchema from a type
export function createObjectSchema<T>(schema: {
  [K in keyof T]: ValidFn<T[K]>
}): ObjectSchema<T> {
  return schema
}

export function getCallerName(): string | undefined {
  try {
    const err = new Error()
    if (!err.stack) {
      return undefined // Stack trace not available
    }

    const stackLines = err.stack.split('\n')
    if (stackLines.length < 4) {
      return undefined // Not enough stack frames
    }

    const callerLine = stackLines[3].trim() // Get the line for the caller

    // Extract the function name (this regex might need adjustments)
    const match =
      /at\s+([\w$.]+)\s+\(/.exec(callerLine) ||
      /at\s+([\w$.]+)$/.exec(callerLine)
    if (match && match[1]) {
      return match[1]
    }

    return undefined
  } catch {
    return undefined // Error getting caller name
  }
}
