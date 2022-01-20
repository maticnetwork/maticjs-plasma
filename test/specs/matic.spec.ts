import { erc20, from, plasmaClient, plasmaClientTo, to } from "./client";
import { expect } from 'chai'
import BN from "bn.js";
import { setProofApi, ABIManager, Converter } from "@maticnetwork/maticjs";


describe('MATIC', () => {

    let erc20Child = plasmaClient.erc20(null);
    let erc20Parent = plasmaClient.erc20(erc20.matic, true);

    const abiManager = new ABIManager("testnet", "mumbai");

    before(() => {
        return Promise.all([
            abiManager.init()
        ]);
    });

    it('check init prop', () => {
        expect(erc20Child['contractParam'].name).equal('MRC20');
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
        const isCheckPointed = await plasmaClient.isCheckPointed('0x4c7ff498b7a3bca131ae88a52832879ae53653a69227c17d70265230ac6269f1');
        expect(isCheckPointed).to.be.an('boolean').equal(true);
    })

    it('child transfer matic returnTransaction', async () => {
        const amount = 10;
        const result = await erc20Child.transfer(amount, to, {
            returnTransaction: true
        });
        expect(result).to.have.not.property('value', amount)
        expect(result).to.have.property('chainId', 80001);
        expect(result).to.have.property('value', Converter.toHex(amount));
        expect(result).to.have.property('from', from);
        expect(result).to.have.property('to', to);
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
        expect(result).to.have.property('chainId', 5);

    });

    it('isDeposited', async () => {
        const txHash = '0xccbc00bea5c0773abddc2e220efab71b25b6b8d1efdfd5418025cf852ce30cf3';
        const isExited = await plasmaClient.isDeposited(txHash);
        expect(isExited).to.be.an('boolean').equal(true);
    })

    it('withdrawstart return tx', async () => {
        const result = await erc20Child.withdrawStart('10', {
            returnTransaction: true
        });
        console.log('result', result)
        expect(result['to'].toLowerCase()).equal(erc20.maticChild.toLowerCase());
        expect(result).to.have.property('data')
    });

    it('approve return tx', async () => {
        const result = await erc20Parent.approve('10', {
            returnTransaction: true
        });

        expect(result['to'].toLowerCase()).equal(erc20.matic.toLowerCase());
        expect(result).to.have.property('data')

    });

    it('deposit return tx', async () => {
        const result = await erc20Parent.deposit(10, from, {
            returnTransaction: true
        });

        const depositManager = await abiManager.getConfig("Main.Contracts.DepositManagerProxy")
        expect(result['to'].toLowerCase()).equal(depositManager.toLowerCase());
    });

    it('withdrawConfirm return tx', async () => {
        const result = await erc20Parent.withdrawConfirm('0x04495c5507293a9583e0e1249b0f2b981eebbe475b3e7b19bd754f72ea7d2a18', {
            returnTransaction: true
        });

        const erc20Predicate = await abiManager.getConfig("Main.Contracts.ERC20Predicate")
        expect(result['to'].toLowerCase()).equal(erc20Predicate.toLowerCase());
    });

    it('withdrawConfirmFaster return tx', async () => {
        setProofApi("https://apis.matic.network");
        const result = await erc20Parent.withdrawConfirmFaster('0x04495c5507293a9583e0e1249b0f2b981eebbe475b3e7b19bd754f72ea7d2a18', {
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
        expect(txReceipt.from.toLowerCase()).equal(from.toLowerCase());
        expect(txReceipt.to.toLowerCase()).equal(to.toLowerCase());
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
