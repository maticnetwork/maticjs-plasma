const { getPlasmaClient, from, plasma } = require('../utils')

const execute = async () => {
  const plasmaClient = await getPlasmaClient()
  const erc20Token = plasmaClient.erc20(plasma.parent.erc20, true)

  const result = await erc20Token.getAllowance(from)

  console.log('result', result)
}
execute().then(() => {
}).catch(err => {
  console.error('err', err)
}).finally(_ => {
  process.exit(0)
})
