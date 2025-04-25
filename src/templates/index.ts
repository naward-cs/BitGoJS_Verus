import type {Stack} from '../types'

import {decompile} from '../script'
import multisig from './multisig'
import nullData from './nulldata'
import pubKey from './pubkey'
import pubKeyHash from './pubkeyhash'
import scriptHash from './scripthash'
import smartTransaction from './smarttransaction'
import witnessCommitment from './witnesscommitment'
import witnessPubKeyHash from './witnesspubkeyhash'
import witnessScriptHash from './witnessscripthash'

const types = {
  MULTISIG: 'multisig',
  NONSTANDARD: 'nonstandard',
  NULLDATA: 'nulldata',
  P2PK: 'pubkey',
  P2PKH: 'pubkeyhash',
  P2SH: 'scripthash',
  P2WPKH: 'witnesspubkeyhash',
  P2WSH: 'witnessscripthash',
  WITNESS_COMMITMENT: 'witnesscommitment',
  SMART_TRANSACTION: 'smarttransaction',
}

function classifyOutput(script: Buffer | Stack): string {
  if (witnessPubKeyHash.output.check(script)) return types.P2WPKH
  if (witnessScriptHash.output.check(script)) return types.P2WSH
  if (pubKeyHash.output.check(script)) return types.P2PKH
  if (scriptHash.output.check(script)) return types.P2SH

  // XXX: optimization, below functions .decompile before use
  const chunks = decompile(script)
  if (smartTransaction.output.check(chunks)) return types.SMART_TRANSACTION
  if (multisig.output.check(chunks)) return types.MULTISIG
  if (pubKey.output.check(chunks)) return types.P2PK
  if (witnessCommitment.output.check(chunks)) return types.WITNESS_COMMITMENT
  if (nullData.output.check(chunks)) return types.NULLDATA

  return types.NONSTANDARD
}

function classifyInput(
  script: Buffer | Stack,
  allowIncomplete?: boolean,
): string {
  // XXX: optimization, below functions .decompile before use
  const chunks = decompile(script)

  if (pubKeyHash.input.check(chunks)) return types.P2PKH
  if (scriptHash.input.check(chunks, allowIncomplete)) return types.P2SH
  if (multisig.input.check(chunks, allowIncomplete)) return types.MULTISIG
  if (smartTransaction.input.check(chunks)) return types.SMART_TRANSACTION
  if (pubKey.input.check(chunks)) return types.P2PK

  return types.NONSTANDARD
}

function classifyWitness(
  script: Buffer | Stack,
  allowIncomplete?: boolean,
): string {
  // XXX: optimization, below functions .decompile before use
  const chunks = decompile(script)

  if (witnessPubKeyHash.input.check(chunks)) return types.P2WPKH
  if (witnessScriptHash.input.check(chunks, allowIncomplete)) return types.P2WSH

  return types.NONSTANDARD
}

export default {
  classifyInput,
  classifyOutput,
  classifyWitness,
  multisig,
  nullData,
  pubKey,
  pubKeyHash,
  scriptHash,
  smartTransaction,
  witnessPubKeyHash,
  witnessScriptHash,
  witnessCommitment,
  types,
}
