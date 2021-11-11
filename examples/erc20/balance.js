const { getPlasmaClient, from, plasma } = require('../utils')

const execute = async () => {
  const plasmaClient = await getPlasmaClient()
  const erc20Token = plasmaClient.erc20(plasma.child.erc20)

  // get balance of user
  const balance = await erc20Token.getBalance(from)
  console.log('balance', balance)
}

execute().then(() => {
}).catch(err => {
  console.error('err', err)
}).finally(_ => {
  process.exit(0)
})
