const { getPlasmaClient, plasma, from } = require('../utils')

const token = plasma.parent.erc721
const tokenId721 = '2'
async function execute () {
  const plasmaClient = await getPlasmaClient()
  const erc721RootToken = plasmaClient.erc721(token, true)
  const result = await erc721RootToken.safeDeposit(tokenId721, from)
  const txHash = await result.getTransactionHash()
  const txReceipt = await result.getReceipt()
  console.log(txReceipt)
}

execute()
  .then(console.log)
  .then(_ => {
    process.exit(0)
  })
