const dotenv = require('dotenv');
const path = require('path');
const env = dotenv.config({
    path: path.join(__dirname, '.env')
});
module.exports = {
    rpc: {
        parent: process.env.ROOT_RPC,
        child: process.env.MATIC_RPC || 'https://rpc-amoy.polygon.technology',
    },
    plasma: {
        parent: {
            matic:'0x3fd0A53F4Bf853985a95F4Eb3F9C9FDE1F8e2b53'
        },
        child: {
            matic:'0x0000000000000000000000000000000000001010'
        },
        registryAddress: '0xfE92F7c3a701e43d8479738c8844bCc555b9e5CD',
        rootChainAddress: '0xbd07D7E1E93c8d4b2a261327F3C28a8EA7167209',
        withdrawManagerAddress: '0x822db7e79096E7247d9273E5782ecAec464Eb96C',
        depositManagerAddress: '0x44Ad17990F9128C6d823Ee10dB7F0A5d40a731A4',
    },
    user1: {
        "privateKey": process.env.USER1_PRIVATE_KEY,
        "address": process.env.USER1_FROM
    },
    user2: {
        address: process.env.USER2_FROM, // Your address
        "privateKey": process.env.USER2_PRIVATE_KEY,

    },
}
