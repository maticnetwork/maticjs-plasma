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
  },
  parent: {
    rpc: process.env.ROOT_RPC
  },
  child: {
    rpc: process.env.MATIC_RPC || 'https://rpc-mumbai.matic.today'
  },
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
