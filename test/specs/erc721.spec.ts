import { erc721, from, plasmaClient, plasmaClientTo, to } from "./client";
import { expect } from 'chai'
import { ABIManager, setProofApi } from "@maticnetwork/maticjs";


describe('ERC721', () => {

    let erc721Child = plasmaClient.erc721(erc721.child);
    let erc721Parent = plasmaClient.erc721(erc721.parent, true);


    const abiManager = new ABIManager("testnet", "mumbai");

    before(() => {
        return Promise.all([
            abiManager.init()
        ]);
    });

    it('getTokensCounts child', async () => {
        const tokensCount = await erc721Child.getTokensCount(from);
        console.log('tokensCount', tokensCount);
        expect(tokensCount).to.be.an('number');
        expect(tokensCount).gte(0);
    })

    it('getTokensCount parent', async () => {
        const tokensCount = await erc721Parent.getTokensCount(from);
        console.log('tokensCount', tokensCount);
        expect(tokensCount).to.be.an('number');
        expect(tokensCount).gte(0);
    })

    it('getAllTokens child', async () => {
        const tokensCount = await erc721Child.getTokensCount(from);
        const allTokens = await erc721Child.getAllTokens(from);
        expect(allTokens).to.be.an('array').length(tokensCount);
    })

    it('getAllTokens parent', async () => {
        const tokensCount = await erc721Parent.getTokensCount(from);
        const allTokens = await erc721Parent.getAllTokens(from);
        expect(allTokens).to.be.an('array').length(tokensCount);
    })

    it('isDeposited', async () => {
        const isDeposited = await plasmaClient.isDeposited("0x041fd0e39d523b78aaeea92638f076b3d51fec5f587e0eebdfa2e0e11025c610");
        expect(isDeposited).equal(true);
    })

    // it('withdrawChallenge return tx', async () => {
    //     const result = await erc721Parent.withdrawChallenge('0x41162584974896bfc96d91e7ce72009373cd31acabe92024950831ee7b8067c0', {
    //         returnTransaction: true
    //     });

    //     const rootChainManager = await abiManager.getConfig("Main.POSContracts.RootChainManagerProxy")
    //     expect(result['to'].toLowerCase()).equal(rootChainManager.toLowerCase());
    // });

    // it('withdrawChallengeFaster return tx', async () => {
    //     setProofApi("https://apis.matic.network");
    //     const result = await erc721Parent.withdrawChallengeFaster('0x41162584974896bfc96d91e7ce72009373cd31acabe92024950831ee7b8067c0', {
    //         returnTransaction: true
    //     });

    //     const rootChainManager = await abiManager.getConfig("Main.POSContracts.RootChainManagerProxy")
    //     expect(result['to'].toLowerCase()).equal(rootChainManager.toLowerCase());
    // });

    it('withdrawExit return tx', async () => {
        const result = await erc721Parent.withdrawExit({
            returnTransaction: true
        });

        const withdrawManagerProxy = await abiManager.getConfig("Main.Contracts.WithdrawManagerProxy")
        expect(result['to'].toLowerCase()).equal(withdrawManagerProxy.toLowerCase());
    });

    it('transfer write', async () => {
        const allTokensFrom = await erc721Child.getAllTokens(from);
        console.log('allTokensFrom', allTokensFrom);
        const allTokensTo = await erc721Child.getAllTokens(to);
        console.log('allTokensTo', allTokensTo);

        const targetToken = allTokensFrom[0];

        if (!targetToken) {
            throw new Error("no tokens is available for user to transfer");
        }

        let result = await erc721Child.transfer(targetToken, from, to);

        let txHash = await result.getTransactionHash();
        expect(txHash).to.be.an('string');
        // console.log('txHash', txHash);
        let txReceipt = await result.getReceipt();
        // console.log("txReceipt", txReceipt);

        expect(txReceipt.transactionHash).equal(txHash);
        expect(txReceipt).to.be.an('object');
        expect(txReceipt.from.toLowerCase()).equal(from.toLowerCase());
        expect(txReceipt.to.toLowerCase()).equal(erc721.child.toLowerCase());
        expect(txReceipt.type).equal('0x0');
        expect(txReceipt.gasUsed).to.be.an('number').gt(0);
        expect(txReceipt.cumulativeGasUsed).to.be.an('number').gt(0);


        const newAllTokensFrom = await erc721Child.getAllTokens(from);
        console.log('newAllTokensFrom', newAllTokensFrom);
        expect(newAllTokensFrom.length).equal(allTokensFrom.length - 1);
        const newAllTokensTo = await erc721Child.getAllTokens(to);
        console.log('newAllTokensTo', newAllTokensTo);
        expect(newAllTokensTo.length).equal(allTokensTo.length + 1);


        const erc721ChildToken = plasmaClientTo.erc721(erc721.child);


        // transfer token back to sender
        result = await erc721ChildToken.transfer(targetToken, to, from);
        txHash = await result.getTransactionHash();
        txReceipt = await result.getReceipt();

        const newFromCount = await erc721Child.getTokensCount(from);
        const newToCount = await erc721Child.getTokensCount(to);

        expect(newFromCount).equal(allTokensFrom.length);
        expect(newToCount).equal(allTokensTo.length);

    })

});
