const dotenv = require('dotenv')
const path = require('path')
const env = dotenv.config({
  path: path.join(__dirname, '.env')
})

module.exports = {
  plasma: {
    parent: {
      erc20: '0x499d11e0b6eac7c0593d8fb292dcbbf815fb29ae',
      erc721: '0xfA08B72137eF907dEB3F202a60EfBc610D2f224b'
    },
    child: {
      erc20: '0xfe4f5145f6e09952a5ba9e956ed0c25e3fa4c7f1',
      erc721: '0x33FC58F12A56280503b04AC7911D1EceEBcE179c'
    },
    registryAddress: '0x56B082d0a590A7ce5d170402D6f7f88B58F71988',
    rootChainAddress: '0x82a72315E16cE224f28E1F1fB97856d3bF83f010', // The address for the main Plasma contract in  Ropsten testnet
    withdrawManagerAddress: '0x3cf9aD3395028a42EAfc949e2EC4588396b8A7D4', // An address for the WithdrawManager contract on Ropsten testnet
    depositManagerAddress: '0x3Bc6701cA1C32BBaC8D1ffA2294EE3444Ad93989' // An address for a DepositManager contract in Ropsten testnet
  },
  parent: {
    rpc: process.env.ROOT_RPC
  },
  child: {
    rpc: process.env.MATIC_RPC || 'https://rpc-mumbai.matic.today'
  },
  SYNCER_URL: 'https://testnetv3-syncer.api.matic.network/api/v1', // Backend service which syncs the Matic sidechain state to a MySQL database which we use for faster querying. This comes in handy especially for constructing withdrawal proofs while exiting assets from Plasma.
  WATCHER_URL: 'https://testnetv3-watcher.api.matic.network/api/v1', // Backend service which syncs the Matic Plasma contract events on Ethereum mainchain to a MySQL database which we use for faster querying. This comes in handy especially for listening to asset deposits on the Plasma contract.
  user1: {
    // '<paste your private key here>' - A sample private key prefix with `0x`
    privateKey: process.env.USER1_PRIVATE_KEY,
    // '<paste address belonging to private key here>', Your address
    address: process.env.USER1_FROM
  },
  user2: {
    address: process.env.USER2_FROM
  }
}
