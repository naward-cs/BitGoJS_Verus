import type {coins} from '../networks'
import type {Prettify} from './prettify'

/** @deprecated */
export type CoinKey = keyof typeof coins
/** @deprecated */
export type Coin = (typeof coins)[CoinKey]

export type NetworkName =
  | 'bitcoin'
  | 'testnet'
  | 'bitcoincash'
  | 'bitcoincashTestnet'
  | 'bitcoingold'
  | 'bitcoingoldTestnet'
  | 'bitcoinsv'
  | 'bitcoinsvTestnet'
  | 'dash'
  | 'dashTest'
  | 'default'
  | 'digibyte'
  | 'doge'
  | 'litecoin'
  | 'litecoinTest'
  | 'kmd'
  | 'verus'
  | 'verustest'
  | 'zcash'
  | 'zcashTest'

export type Network =
  | BaseNetwork
  | ZcashNetwork
  | PBaaSNetwork
  | DigiDogeNetwork
  | BitcoinCashNetwork

export type BaseNetwork = {
  messagePrefix: string
  pubKeyHash: number
  scriptHash: number
  wif: number
  bip32: {
    public: number
    private: number
  }
  bech32?: string
  /**
   * @deprecated
   */
  coin: Coin
  forkId?: number
}

export type ZcashNetwork = BaseNetwork & {
  consensusBranchId: Record<number, number>
  isZcashCompatible: boolean
}

export type PBaaSNetwork = Required<ZcashNetwork> & {
  verusID: number
  isPBaaS: boolean
}

export type PBaaSType = Prettify<PBaaSNetwork>

export type DigiDogeNetwork = BaseNetwork & {
  bip44: number
  dustThreshold: number
}

export type BitcoinCashNetwork = BaseNetwork & {
  cashAddr: {
    prefix: string
    pubKeyHash: number
    scriptHash: number
  }
}
