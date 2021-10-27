// const dotenv = require('dotenv');
// const path = require('path');
// const env = dotenv.config({
//     path: path.join(__dirname, '.env')
// });
module.exports = {
    rpc: {
        parent: process.env.ROOT_RPC,
        child: process.env.MATIC_RPC || 'https://rpc-mumbai.matic.today',
    },
    plasma: {
        parent: {
            erc20: '0x3f152B63Ec5CA5831061B2DccFb29a874C317502',
            erc721: '0xfA08B72137eF907dEB3F202a60EfBc610D2f224b',
        },
        child: {
            erc20: '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
            erc721: '0x33FC58F12A56280503b04AC7911D1EceEBcE179c',
        },
        registryAddress: '0x56B082d0a590A7ce5d170402D6f7f88B58F71988',
        rootChainAddress: '0x82a72315E16cE224f28E1F1fB97856d3bF83f010', // The address for the main Plasma contract in  Ropsten testnet
        withdrawManagerAddress: '0x3cf9aD3395028a42EAfc949e2EC4588396b8A7D4', // An address for the WithdrawManager contract on Ropsten testnet
        depositManagerAddress: '0x3Bc6701cA1C32BBaC8D1ffA2294EE3444Ad93989', // An address for a DepositManager contract in Ropsten testnet
    },
    user1: {
        "privateKey": process.env.USER1_PRIVATE_KEY,
        "address": process.env.USER1_FROM
    },
    user2: {
        address: process.env.USER2_FROM, // Your address
    },
}
