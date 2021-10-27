import { TYPE_AMOUNT, Log_Event_Signature, Converter, Web3SideChainClient, ITransactionOption, MAX_AMOUNT } from "@maticnetwork/maticjs";
import { MATIC_TOKEN_ADDRESS_ON_POLYGON } from "./constant";
import { IPlasmaClientConfig, IPlasmaContracts } from "./interfaces";
import { PlasmaToken } from "./plasma_token";

export class ERC20 extends PlasmaToken {

    constructor(
        tokenAddress: string,
        isParent: boolean,
        client: Web3SideChainClient<IPlasmaClientConfig>,
        contracts: IPlasmaContracts
    ) {
        super({
            isParent,
            address: tokenAddress,
            name: 'ChildERC20'
        }, client, contracts);
    }

    getPredicate() {
        return this['getPredicate_'](
            "erc20Predicate", "ERC20Predicate", this.client.config.erc20Predicate
        );
    }


    getBalance(userAddress: string, option: ITransactionOption = {}) {
        return this.getContract().then(contract => {
            const method = contract.method(
                "balanceOf",
                userAddress
            );
            return this.processRead<string>(method, option);
        });
    }

    /**
     * get allowance for user
     *
     * @param {string} userAddress
     * @param {ITransactionOption} [option]
     * @returns
     * @memberof ERC20
     */
    getAllowance(userAddress: string, option?: ITransactionOption) {
        this.checkForRoot("getAllowance");

        return this.getContract().then(contract => {
            const method = contract.method(
                "allowance",
                userAddress,
                this.contracts_.depositManager.address,
            );
            return this.processRead<string>(method, option);
        });
    }

    approve(amount: TYPE_AMOUNT, option: ITransactionOption = {}) {
        this.checkForRoot("approve");
        return this.getContract().then(contract => {
            const method = contract.method(
                "approve",
                this.contracts_.depositManager.address,
                Converter.toHex(amount)
            );
            return this.processWrite(method, option);
        });

    }

    approveMax(option: ITransactionOption = {}) {
        return this.approve(
            MAX_AMOUNT
            , option
        );
    }

    deposit(amount: TYPE_AMOUNT, userAddress: string, option: ITransactionOption = {}) {
        this.checkForRoot("deposit");

        return this.contracts_.depositManager.getContract().then(contract => {
            const method = contract.method(
                "depositERC20ForUser",
                this.contractParam.address,
                userAddress,
                Converter.toHex(amount)
            );
            return this.processWrite(method, option);
        });
    }

    private depositEther__(amount: TYPE_AMOUNT, option: ITransactionOption = {}) {
        this.checkForRoot("depositEther");

        return this.contracts_.depositManager.getContract().then(contract => {
            option.value = Converter.toHex(amount);
            const method = contract.method(
                "depositEther",
            );
            return this.processWrite(method, option);
        });
    }

    withdrawStart(amount: TYPE_AMOUNT, option?: ITransactionOption) {
        this.checkForChild("withdrawStart");


        return this.getContract().then(tokenContract => {
            const method = tokenContract.method(
                "withdraw",
                Converter.toHex(amount)
            );
            return this.processWrite(method, option);
        });
    }

    private withdrawChallenge_(burnTxHash: string, isFast: boolean, option: ITransactionOption) {
        this.checkForRoot("withdrawChallenge");

        return Promise.all([
            this.getPredicate(),
            this.contracts_.exitUtil.buildPayloadForExit(
                burnTxHash,
                Log_Event_Signature.PlasmaErc20WithdrawEventSig,
                isFast
            )
        ]).then(result => {
            const [predicate, payload] = result;
            const method = predicate.method(
                "startExitWithBurntTokens",
                payload
            );
            return this.processWrite(method, option);
        });
    }

    withdrawChallenge(burnTxHash: string, option?: ITransactionOption) {
        return this.withdrawChallenge_(burnTxHash, false, option);
    }

    withdrawChallengeFaster(burnTxHash: string, option?: ITransactionOption) {
        return this.withdrawChallenge_(burnTxHash, true, option);
    }

    transfer(to: string, amount: TYPE_AMOUNT, option: ITransactionOption = {}) {
        if (this.contractParam.address === MATIC_TOKEN_ADDRESS_ON_POLYGON) {
            option.to = to;
        }
        return this.transferERC20(to, amount, option);
    }
}