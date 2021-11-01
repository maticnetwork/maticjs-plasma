import { erc721, from, plasmaClient } from "./client";
import { expect } from 'chai'
import { ABIManager, setProofApi } from "@maticnetwork/maticjs";


describe('ERC721', () => {

    let erc721Child = plasmaClient.erc721(erc721.child);
    let erc721Parent = plasmaClient.erc721(erc721.parent, true);


    const abiManager = new ABIManager("testnet", "mumbai");

    before(() => {
        return Promise.all([
            plasmaClient.init(),
            abiManager.init()
        ]);
    });

    it('getTokensCounts child', async () => {
        const tokensCount = await erc721Child.getTokensCount(from);
        console.log('tokensCount', tokensCount);
        expect(tokensCount).to.be.an('string');
        expect(Number(tokensCount)).gte(0);
    })

    it('getTokensCount parent', async () => {
        const tokensCount = await erc721Parent.getTokensCount(from);
        console.log('tokensCount', tokensCount);
        expect(tokensCount).to.be.an('string');
        expect(Number(tokensCount)).gte(0);
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

});