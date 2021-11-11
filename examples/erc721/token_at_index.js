const { getPlasmaClient, from, plasma } = require('../utils')

const execute = async () => {
  const plasmaClient = await getPlasmaClient()
  const erc721Token = plasmaClient.erc721(plasma.child.erc721)

  // get token at index 2
  const token = await erc721Token.getTokenIdAtIndexForUser(2, from)
  console.log(token)
}

execute().then(() => {
}).catch(err => {
  console.error('err', err)
}).finally(_ => {
  process.exit(0)
})
