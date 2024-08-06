const dotenv = require('dotenv')
const path = require('path')
const env = dotenv.config({
  path: path.join(__dirname, '.env')
})

module.exports = {
  plasma: {
    parent: {
      erc20: '0x3fd0A53F4Bf853985a95F4Eb3F9C9FDE1F8e2b53'
    },
    child: {
      erc20: '0x0000000000000000000000000000000000001010'
    },
  },
  parent: {
    rpc: process.env.ROOT_RPC
  },
  child: {
    rpc: process.env.MATIC_RPC || 'https://rpc-amoy.polygon.technology'
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
