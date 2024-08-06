const { user1, rpc, plasma, user2 } = require("./config");

const { use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-web3");
const { PlasmaClient } = require("@maticnetwork/maticjs-plasma");

const HDWalletProvider = require("@truffle/hdwallet-provider");
use(Web3ClientPlugin);
const from = user1.address;

const execute = async () => {
  const privateKey = user1.privateKey;

  const client = new PlasmaClient();

  await client.init({
    log: true,
    network: 'testnet',
    version: 'amoy',
    parent: {
      provider: new HDWalletProvider(privateKey, rpc.parent),
      defaultConfig: {
        from
      }
    },
    child: {
      provider: new HDWalletProvider(privateKey, rpc.child),
      defaultConfig: {
        from
      }
    }
  });

  const maticToken = client.erc20(plasma.parent.matic, true);
  // console.log(maticToken)
  // const user1MaticBalance = await maticToken.getBalance(from);
  // console.log('user1Maticbalance', user1MaticBalance);

  // const user2MaticBalance = await maticToken.getBalance(to);
  // console.log('user2MaticBalance', user2MaticBalance);

  const result = await maticToken.approveMax({
    // returnTransaction: true
  })
  // return console.log('result', result);
  const txHash = await result.getTransactionHash();
  console.log(txHash)
  const txReceipt = await result.getReceipt();
  console.log(txReceipt)
}

execute().then(_ => {
  process.exit(0)
}).catch(err => {
  console.error(err);
  process.exit(0);
})
