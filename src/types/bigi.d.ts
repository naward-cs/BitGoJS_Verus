/* eslint-disable @typescript-eslint/no-explicit-any */
import type {randomBytes} from 'crypto'

declare module 'bigi' {
  interface RandomGenerator extends randomBytes {
    nextBytes(bytes: number[]): void
  }

  declare class BigInteger {
    constructor(a?: any, b?: any, c?: any)
    abs(): BigInteger
    add(a: BigInteger): BigInteger
    addTo(a: BigInteger, r: BigInteger): void
    am(
      i: number,
      x: number,
      w: BigInteger,
      j: number,
      c: number,
      n: number,
    ): number
    and(a: BigInteger): BigInteger
    andNot(a: BigInteger): BigInteger
    bitCount(): number
    bitLength(): number
    bitwiseTo(a: BigInteger, op: any, r: BigInteger): void
    byteLength(): number
    byteValue(): number
    changeBit(n: number, op: any): BigInteger
    chunkSize(r: number): number
    clamp(): void
    clearBit(n: number): BigInteger
    clone(): BigInteger
    compareTo(a: BigInteger): number
    copyTo(r: BigInteger): void
    dAddOffset(n: number, w: number): void
    dMultiply(n: number): void
    divRemTo(m: BigInteger, q: BigInteger | null, r: BigInteger | null): void
    divide(a: BigInteger): BigInteger
    divideAndRemainder(a: BigInteger): BigInteger
    dlShiftTo(n: BigInteger, r: number): void
    drShiftTo(n: BigInteger, r: number): void
    equals(a: BigInteger): boolean
    exp(e: number, z: any): BigInteger
    flipBit(n: number): BigInteger
    fromInt(x: number): void
    fromNumber(
      a: number,
      b: number | RandomGenerator,
      c?: RandomGenerator,
    ): void
    fromRadix(s: string | number[] | Buffer, b?: number | null): void
    fromString(s: string, b: number | null): void
    gcd(a: BigInteger): BigInteger
    getLowestSetBit(): number
    intValue(): number
    invDigit(): number
    isEven(): boolean
    isProbablePrime(t?: number): boolean
    lShiftTo(n: number, r: BigInteger): void
    max(a: BigInteger): BigInteger
    millerRabin(t: BigInteger): BigInteger
    min(a: BigInteger): BigInteger
    mod(a: BigInteger): BigInteger
    modInt(n: number): BigInteger
    modInverse(m: BigInteger): BigInteger
    modPow(e: BigInteger, m: BigInteger): BigInteger
    modPowInt(e: BigInteger, m: BigInteger): BigInteger
    multiply(a: BigInteger): BigInteger
    multiplyLowerTo(a: BigInteger, n: number, r: BigInteger): void
    multiplyTo(a: BigInteger, r: BigInteger): void
    multiplyUpperTo(a: BigInteger, n: number, r: BigInteger): void
    negate(): BigInteger
    not(): BigInteger
    or(a: BigInteger): BigInteger
    pow(e: BigInteger): BigInteger
    rShiftTo(n: number, r: BigInteger): void
    remainder(a: BigInteger): BigInteger
    setBit(n: number): BigInteger
    shiftLeft(n: number): BigInteger
    shiftRight(n: number): BigInteger
    shortValue(): BigInteger
    signum(): number
    square(): BigInteger
    squareTo(r: BigInteger): void
    subTo(a: BigInteger, r: BigInteger): void
    subtract(a: BigInteger): BigInteger
    testBit(n: number): boolean
    toBuffer(size?: number): Buffer
    toByteArray(): number[] | Uint8Array
    toByteArrayUnsigned(): number[] | Uint8Array
    toDERInteger(): number[] | Uint8Array
    toHex(size?: number): string
    toRadix(b: number): string
    toString(b?: number): string
    xor(a: BigInteger): BigInteger
    static fromBuffer(buffer: Buffer): BigInteger
    static fromByteArrayUnsigned(
      byteArray?: Buffer | Uint8Array | number[],
    ): number[]
    static fromDERInteger(
      byteArray?: Buffer | Uint8Array | number[],
    ): BigInteger
    static fromHex(hex: string): BigInteger
    static isBigInteger(obj: unknown, check_ver: any): obj is BigInteger
    static valueOf(i: number): BigInteger
  }

  declare namespace BigInteger {
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
    const ONE: BigInteger & Constants
    const ZERO: BigInteger & Constants
  }
}
