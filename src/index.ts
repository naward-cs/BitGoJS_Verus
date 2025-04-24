const script = require('./script')

const templates = require('./templates')
for (const key in templates) {
  script[key] = templates[key]
}

export default {
  bitgo: require('./bitgo'),
  bufferutils: require('./bufferutils'), // TODO: remove in 4.0.0

  Block: require('./block'),
  ECPair: require('./ecpair'),
  ECSignature: require('./ecsignature'),
  HDNode: require('./hdnode'),
  Transaction: require('./transaction'),
  TransactionBuilder: require('./transaction_builder'),
  SmartTransactionSignatures: require('./smart_transaction_signatures'),
  SmartTransactionSignature: require('./smart_transaction_signature'),
  TxDestination: require('./tx_destination'),
  OptCCParams: require('./optccparams'),
  IdentitySignature: require('./identity_signature'),

  smarttxs: require('./smart_transactions'),
  address: require('./address'),
  coins: require('./networks/coins'),
  crypto: require('./crypto'),
  networks: require('./networks/networks'),
  opcodes: require('bitcoin-ops'),
  script: script,
}
