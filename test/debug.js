const { use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-web3");
const { PlasmaClient } = require("@maticnetwork/maticjs-plasma");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { user1, rpc, plasma, user2 } = require("./config");
use(Web3ClientPlugin);
const from = user1.address;
const to = user2.address;

const execute = async () => {
  const privateKey = user1.privateKey;
  const mumbaiERC20 = plasma.child.erc20;
  const goerliERC20 = plasma.parent.erc20;
  const goerliERC721 = plasma.parent.erc721;
  const mumbaiERC721 = plasma.child.erc721;

  const client = new PlasmaClient();


  await client.init({
    log: true,
    network: 'testnet',
    version: 'mumbai',
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
  console.log("init called");

  const mumbaiERC20Token = client.erc20(mumbaiERC20);
  const goerliERC20Token = client.erc20(goerliERC20, true);
  const goerliERC721Token = client.erc721(goerliERC721, true);
  const mumbaiERC721Token = client.erc721(mumbaiERC721);



  const maticToken = client.erc20(null);

  const user1MaticBalance = await maticToken.getBalance(from);
  console.log('user1Maticbalance', user1MaticBalance);

  const user2MaticBalance = await maticToken.getBalance(to);
  console.log('user2MaticBalance', user2MaticBalance);


  const result = await maticToken.transfer(10000000, to, { returnTransaction: true, gasPrice: 1000000000 })
  console.log('result', result);
  // const txHash = await result.getTransactionHash();
  // console.log(txHash)
}

execute().then(_ => {
  process.exit(0)
}).catch(err => {
  console.error(err);
  process.exit(0);
})
