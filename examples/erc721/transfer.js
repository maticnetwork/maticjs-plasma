const { getPlasmaClient, from, plasma, to } = require('../utils')

const tokenId721 = '2'

const execute = async () => {
  const plasmaClient = await getPlasmaClient()
  const erc721Token = plasmaClient.erc721(plasma.child.erc721)

  // transfer token
  const result = await erc721Token.transfer(tokenId721, from, to)
  console.log(await result.getReceipt())
}

execute().then(() => {
}).catch(err => {
  console.error('err', err)
}).finally(_ => {
  process.exit(0)
})
