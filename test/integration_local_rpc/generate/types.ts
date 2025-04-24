/**
 * @prettier
 */

import {Input} from '../../../src/bitgo/signature'
import {Network} from '../../../src/types'

type Output = {
  value: number
  script: Buffer
}

export type Transaction = {
  network: Network
  ins: Input[]
  outs: Output[]
  getId(): string
  hashForSignatureByNetwork(
    index: number,
    pubScript: Buffer,
    amount: number,
    hashType: number,
    isSegwit: boolean,
  )
  toBuffer(): Buffer
}

export type Triple<T> = [T, T, T]
