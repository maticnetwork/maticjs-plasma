const { getPlasmaClient, from, plasma } = require('../utils')

const execute = async () => {
  const plasmaClient = await getPlasmaClient()
  const erc721Token = plasmaClient.erc721(plasma.child.erc721)

  // get tokens count
  const count = await erc721Token.getTokensCount(from)
  console.log(count)
}

execute().then(() => {
}).catch(err => {
  console.error('err', err)
}).finally(_ => {
  process.exit(0)
})
