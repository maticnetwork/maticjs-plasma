import { erc20, from, plasmaClient, plasmaClientTo, to } from "./client";
import { expect } from 'chai'
import BN from "bn.js";
import { setProofApi, ABIManager } from "@maticnetwork/maticjs";


describe('ERC20', () => {

    let erc20Child = plasmaClient.erc20(erc20.child);
    let erc20Parent = plasmaClient.erc20(erc20.parent, true);

    const abiManager = new ABIManager("testnet", "mumbai");

    before(() => {
        return Promise.all([
            plasmaClient.init(),
            abiManager.init()
        ]);
    });

    it('get balance child', async () => {
        console.log('process.env.NODE_ENV', process.env.NODE_ENV);

        const balance = await erc20Child.getBalance(from);
        console.log('balance', balance);
        expect(balance).to.be.an('string');
        expect(Number(balance)).gte(0);
    })

    it('get balance parent', async () => {
        const balance = await erc20Parent.getBalance(from);
        console.log('balance', balance);
        expect(balance).to.be.an('string');
        expect(Number(balance)).gte(0);
    })

    it('get allowance', async () => {
        const allowance = await erc20Parent.getAllowance(from);
        expect(allowance).to.be.an('string');
        expect(Number(allowance)).gte(0);
    })

    it('is check pointed', async () => {
        const isCheckPointed = await plasmaClient.isCheckPointed('0xd6f7f4c6052611761946519076de28fbd091693af974e7d4abc1b17fd7926fd7');
        expect(isCheckPointed).to.be.an('boolean').equal(true);
    })

    it('child transfer returnTransaction', async () => {
        const amount = 10;
        const result = await erc20Child.transfer(amount, to, {
            returnTransaction: true
        });
        console.log('result', result);
        expect(result).to.have.not.property('maxFeePerGas')
        expect(result).to.have.not.property('maxPriorityFeePerGas')
        expect(result).to.have.property('gasPrice')
        expect(result).to.have.property('chainId', '0x13881');
    });

    it('parent transfer returnTransaction with erp1159', async () => {
        const amount = 10;
        const result = await erc20Parent.transfer(amount, to, {
            maxFeePerGas: 20,
            maxPriorityFeePerGas: 20,
            returnTransaction: true
        });
        console.log('result', result);

        expect(result).to.have.property('maxFeePerGas', 20)
        expect(result).to.have.property('maxPriorityFeePerGas', 20)
        expect(result).to.have.not.property('gasPrice')
        expect(result).to.have.property('chainId', '0x5');

    });

    it('isDeposited', async () => {
        const txHash = '0xc3245a99dfbf2cf91d92ad535de9ee828208f0be3c0e101cba14d88e7849ed01';
        const isExited = await plasmaClient.isDeposited(txHash);
        expect(isExited).to.be.an('boolean').equal(true);
    })

    it('withdrawstart return tx', async () => {
        const result = await erc20Child.withdrawStart('10', {
            returnTransaction: true
        });
        expect(result['to'].toLowerCase()).equal(erc20.child.toLowerCase());
        expect(result).to.have.property('data')
    });

    it('approve return tx', async () => {
        const result = await erc20Parent.approve('10', {
            returnTransaction: true
        });

        expect(result['to'].toLowerCase()).equal(erc20.parent.toLowerCase());
        expect(result).to.have.property('data')

    });

    it('deposit return tx', async () => {
        const result = await erc20Parent.deposit(10, from, {
            returnTransaction: true
        });

        const depositManager = await abiManager.getConfig("Main.Contracts.DepositManagerProxy")
        expect(result['to'].toLowerCase()).equal(depositManager.toLowerCase());
    });

    it('withdrawChallenge return tx', async () => {
        const result = await erc20Parent.withdrawChallenge('0xfb1c50b5c6cba34031312e67cead610777fe609d08010d1e618d1f38a0a80748', {
            returnTransaction: true
        });

        const erc20Predicate = await abiManager.getConfig("Main.Contracts.ERC20Predicate")
        expect(result['to'].toLowerCase()).equal(erc20Predicate.toLowerCase());
    });

    it('withdrawChallengeFaster return tx without setProofAPI', async () => {
        try {
            const result = await erc20Parent.withdrawChallengeFaster('0xfb1c50b5c6cba34031312e67cead610777fe609d08010d1e618d1f38a0a80748', {
                returnTransaction: true
            });
            throw new Error("there should be exception");
        } catch (error) {
            expect(error).deep.equal({
                message: `Proof api is not set, please set it using "setProofApi"`,
                type: 'proof_api_not_set'
            })
        }
    });

    it('withdrawChallengeFaster return tx', async () => {
        setProofApi("https://apis.matic.network");
        const result = await erc20Parent.withdrawChallengeFaster('0xfb1c50b5c6cba34031312e67cead610777fe609d08010d1e618d1f38a0a80748', {
            returnTransaction: true
        });

        const erc20Predicate = await abiManager.getConfig("Main.Contracts.ERC20Predicate")

        expect(result['to'].toLowerCase()).equal(erc20Predicate.toLowerCase());
    });

    it('withdrawExit return tx', async () => {
        const result = await erc20Parent.withdrawExit({
            returnTransaction: true
        });

        const withdrawManagerProxy = await abiManager.getConfig("Main.Contracts.WithdrawManagerProxy")
        expect(result['to'].toLowerCase()).equal(withdrawManagerProxy.toLowerCase());
    });


    it('child transfer', async () => {
        const oldBalance = await erc20Child.getBalance(to);
        console.log('oldBalance', oldBalance);
        const amount = 10;
        let result = await erc20Child.transfer(amount, to);
        let txHash = await result.getTransactionHash();
        expect(txHash).to.be.an('string');
        console.log('txHash', txHash);
        let txReceipt = await result.getReceipt();
        console.log("txReceipt", txReceipt);

        expect(txReceipt.transactionHash).equal(txHash);
        expect(txReceipt).to.be.an('object');
        expect(txReceipt.from).equal(from);
        expect(txReceipt.to.toLowerCase()).equal(erc20.child.toLowerCase());
        expect(txReceipt.type).equal('0x0');
        expect(txReceipt.gasUsed).to.be.an('number').gt(0);
        expect(txReceipt.cumulativeGasUsed).to.be.an('number').gt(0);

        expect(txReceipt).to.have.property('blockHash')
        expect(txReceipt).to.have.property('blockNumber');
        expect(txReceipt).to.have.property('events');
        // expect(txReceipt).to.have.property('logs');
        expect(txReceipt).to.have.property('logsBloom');
        expect(txReceipt).to.have.property('status');
        expect(txReceipt).to.have.property('transactionIndex');

        const newBalance = await erc20Child.getBalance(to);
        console.log('newBalance', newBalance);

        const oldBalanceBig = new BN(oldBalance);
        const newBalanceBig = new BN(newBalance);

        expect(newBalanceBig.toString()).equal(
            oldBalanceBig.add(new BN(amount)).toString()
        )

        //transfer money back to user
        await plasmaClientTo.init();
        const erc20ChildToken = plasmaClientTo.erc20(erc20.child);

        result = await erc20ChildToken.transfer(amount, to);
        txHash = await result.getTransactionHash();
        txReceipt = await result.getReceipt();
    });

    if (process.env.NODE_ENV !== 'test_all') return;

    it('approve', async () => {
        const result = await erc20Parent.approve('10');

        const txHash = await result.getTransactionHash();
        expect(txHash).to.be.an('string');

        const txReceipt = await result.getReceipt();
        console.log("txReceipt", txReceipt);
        expect(txReceipt.type).equal('0x0');
    });

    it('deposit', async () => {
        const result = await erc20Parent.deposit('10', from);

        const txHash = await result.getTransactionHash();
        expect(txHash).to.be.an('string');

        const txReceipt = await result.getReceipt();
        expect(txReceipt).to.be.an('object');
    });

});