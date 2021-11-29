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



  // return console.log(await goerliERC721Token.getAllTokens(from));

  // return console.log(await client.isDeposited('0xc67599f5c967f2040786d5924ec55d37bf943c009bdd23f3b50e5ae66efde258'));


  // const balance = await mumbaiERC20Token.getBalance(
  //   from
  // );
  // return console.log("balance", balance);

  // const tokens = await goerliERC720Token.getAllTokens(
  //   from
  // );
  // return console.log("tokens", tokens);

  const tx = await mumbaiERC721Token.transfer(700, to, from, {
    // returnTransaction: true
  });
  console.log('tx', tx);
  // // setProofApi("https://apis.matic.network")
  // const tx = await goerliERC20Token.approveMax();
  console.log("txHash", await tx.getTransactionHash());
  return console.log("txReceipt", await tx.getReceipt());

  //txhash to plasma exit - 0x63aa095e0d6ee8698399b871daa202eb5522933e2d94c5929cf0fb86b6b0c628
  const tokenId = '60399350241383852757821046101235634991156913804166740995010931519407953501076'

  // const tx = await (client['client_']).child.getTransactionCount(from, 'pending');
  // console.log("tx", tx);
  // const result = await client.isCheckPointed('0x41162584974896bfc96d91e7ce72009373cd31acabe92024950831ee7b8067c0')
  // console.log("result", result);
  // const tx = await goerliERC721Token.withdrawChallenge(
  //   '0x41162584974896bfc96d91e7ce72009373cd31acabe92024950831ee7b8067c0',
  //   {
  //     // nonce: 11793,
  //     // gasPrice: '1000',
  //     // gas: 10000,
  //     // returnTransaction: true,
  //     // gasPrice: '4000000000',
  //     // returnTransaction: true,
  //     gasLimit: 1046107,
  //   }
  // );
  // console.log("tx", tx)
  // const tx = await goerliERC721Token.safeDeposit('700',from)
  // console.log("txHash", await tx.getTransactionHash());
  // console.log("txReceipt", await tx.getReceipt());
}

execute().then(_ => {
  process.exit(0)
}).catch(err => {
  console.error(err);
  process.exit(0);
})
