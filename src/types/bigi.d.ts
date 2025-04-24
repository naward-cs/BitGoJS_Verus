/* eslint-disable @typescript-eslint/no-explicit-any */
import type {randomBytes} from 'crypto'


declare module 'bigi' {
  interface RandomGenerator extends randomBytes {
    nextBytes(bytes: number[]): void
  }

  declare class bigi {
    constructor(a?: any, b?: any, c?: any)
    abs(): bigi
    add(a: bigi): bigi
    addTo(a: bigi, r: bigi): void
    am(
      i: number,
      x: number,
      w: bigi,
      j: number,
      c: number,
      n: number,
    ): number
    and(a: bigi): bigi
    andNot(a: bigi): bigi
    bitCount(): number
    bitLength(): number
    bitwiseTo(a: bigi, op: any, r: bigi): void
    byteLength(): number
    byteValue(): number
    changeBit(n: number, op: any): bigi
    chunkSize(r: number): number
    clamp(): void
    clearBit(n: number): bigi
    clone(): bigi
    compareTo(a: bigi): number
    copyTo(r: bigi): void
    dAddOffset(n: number, w: number): void
    dMultiply(n: number): void
    divRemTo(m: bigi, q: bigi | null, r: bigi | null): void
    divide(a: bigi): bigi
    divideAndRemainder(a: bigi): bigi
    dlShiftTo(n: bigi, r: number): void
    drShiftTo(n: bigi, r: number): void
    equals(a: bigi): boolean
    exp(e: number, z: any): bigi
    flipBit(n: number): bigi
    fromInt(x: number): void
    fromNumber(
      a: number,
      b: number | RandomGenerator,
      c?: RandomGenerator,
    ): void
    fromRadix(s: string | number[] | Buffer, b?: number | null): void
    fromString(s: string, b: number | null): void
    gcd(a: bigi): bigi
    getLowestSetBit(): number
    intValue(): number
    invDigit(): number
    isEven(): boolean
    isProbablePrime(t?: number): boolean
    lShiftTo(n: number, r: bigi): void
    max(a: bigi): bigi
    millerRabin(t: bigi): bigi
    min(a: bigi): bigi
    mod(a: bigi): bigi
    modInt(n: number): bigi
    modInverse(m: bigi): bigi
    modPow(e: bigi, m: bigi): bigi
    modPowInt(e: bigi, m: bigi): bigi
    multiply(a: bigi): bigi
    multiplyLowerTo(a: bigi, n: number, r: bigi): void
    multiplyTo(a: bigi, r: bigi): void
    multiplyUpperTo(a: bigi, n: number, r: bigi): void
    negate(): bigi
    not(): bigi
    or(a: bigi): bigi
    pow(e: bigi): bigi
    rShiftTo(n: number, r: bigi): void
    remainder(a: bigi): bigi
    setBit(n: number): bigi
    shiftLeft(n: number): bigi
    shiftRight(n: number): bigi
    shortValue(): bigi
    signum(): number
    square(): bigi
    squareTo(r: bigi): void
    subTo(a: bigi, r: bigi): void
    subtract(a: bigi): bigi
    testBit(n: number): boolean
    toBuffer(size?: number): Buffer
    toByteArray(): number[] | Uint8Array
    toByteArrayUnsigned(): number[] | Uint8Array
    toDERInteger(): number[] | Uint8Array
    toHex(size?: number): string
    toRadix(b: number): string
    toString(b?: number): string
    xor(a: bigi): bigi
    static fromBuffer(buffer: Buffer): bigi
    static fromByteArrayUnsigned(
      byteArray?: Buffer | Uint8Array | number[],
    ): number[]
    static fromDERInteger(
      byteArray?: Buffer | Uint8Array | number[],
    ): bigi
    static fromHex(hex: string): bigi
    static isbigi(obj: unknown, check_ver: any): obj is bigi
    static valueOf(i: number): bigi
  }

  declare namespace bigi {
    interface Constants {
      readonly DB: number
      readonly DM: number
      readonly DV: number
      readonly F1: number
      readonly F2: number
      readonly FV: number
      readonly s: number
      readonly t: number
    }
    const ONE: bigi & Constants
    const ZERO: bigi & Constants
  }
}
