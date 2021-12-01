const { getPlasmaClient, from, plasma, to } = require('../utils')

const amount = '1000000000' // amount in wei

async function execute() {
    try {
        const plasmaClient = await getPlasmaClient();

        // initiating token with null means - use matic token address
        const erc20Token = plasmaClient.erc20(null);
        const result = await erc20Token.transfer(amount, to, { gasPrice: 1000000000 })
        const txHash = await result.getTransactionHash();
        const txReceipt = await result.getReceipt();
        console.log(txHash);
    } catch (error) {
        console.log(error)
    }
}

execute().then(() => {
}).catch(err => {
    console.error('err', err)
}).finally(_ => {
    process.exit(0)
})
