const { getPlasmaClient, plasma, from } = require('../utils')

const amount = '1000000000000000000' // amount in wei
const erc20TokenOnParent = plasma.parent.erc20
async function execute () {
  const plasmaClient = await getPlasmaClient()
  const erc20Token = plasmaClient.erc20(erc20TokenOnParent, true)
  const result = await erc20Token.approve(amount)
  console.log(await result.getReceipt())
}

execute().then(() => {
}).catch(err => {
  console.error('err', err)
}).finally(_ => {
  process.exit(0)
})
