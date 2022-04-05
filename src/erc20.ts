import { TYPE_AMOUNT, Converter, Web3SideChainClient, ITransactionOption, MAX_AMOUNT, IApproveTransactionOption, ERROR_TYPE, IAllowanceTransactionOption } from "@maticnetwork/maticjs";
import { MATIC_TOKEN_ADDRESS_ON_POLYGON } from "./constant";
import { Plasma_Log_Event_Signature } from "./enums";
import { IPlasmaClientConfig, IPlasmaContracts } from "./interfaces";
import { PlasmaToken } from "./plasma_token";

export class ERC20 extends PlasmaToken {

    constructor(
        tokenAddress: string,
        isParent: boolean,
        client: Web3SideChainClient<IPlasmaClientConfig>,
        contracts: () => IPlasmaContracts
    ) {
        const isMaticToken = tokenAddress === MATIC_TOKEN_ADDRESS_ON_POLYGON;
        const contractIdentifier = isMaticToken ?
            'MRC20' : 'ChildERC20';
        super({
            isParent,
            address: tokenAddress,
            name: contractIdentifier
        }, client, contracts);
    }

    getPredicate() {
        return this.fetchPredicate(
            "erc20Predicate",
            "ERC20Predicate",
            this.client.config.erc20Predicate
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
    getAllowance(userAddress: string, option: IAllowanceTransactionOption = {}) {
        const spenderAddress = option.spenderAddress;

        return this.getContract().then(contract => {
            const method = contract.method(
                "allowance",
                userAddress,
                spenderAddress || this.getHelperContracts().depositManager.address,
            );
            return this.processRead<string>(method, option);
        });
    }

    approve(amount: TYPE_AMOUNT, option: IApproveTransactionOption = {}) {
        const spenderAddress = option.spenderAddress;

        if (!spenderAddress && !this.contractParam.isParent) {
            this.client.logger.error(ERROR_TYPE.NullSpenderAddress).throw();
        }

        return this.getContract().then(contract => {
            const method = contract.method(
                "approve",
                spenderAddress || this.getHelperContracts().depositManager.address,
                Converter.toHex(amount)
            );
            return this.processWrite(method, option);
        });

    }

    approveMax(option: IApproveTransactionOption = {}) {
        return this.approve(
            MAX_AMOUNT
            , option
        );
    }

    deposit(amount: TYPE_AMOUNT, userAddress: string, option: ITransactionOption = {}) {
        this.checkForRoot("deposit");

        return this.getHelperContracts().depositManager.getContract().then(contract => {
            const method = contract.method(
                "depositERC20ForUser",
                this.contractParam.address,
                userAddress,
                Converter.toHex(amount)
            );
            return this.processWrite(method, option);
        });
    }

    private depositEther_(amount: TYPE_AMOUNT, option: ITransactionOption = {}) {
        this.checkForRoot("depositEther");

        return this.getHelperContracts().depositManager.getContract().then(contract => {
            option.value = Converter.toHex(amount);
            const method = contract.method(
                "depositEther",
            );
            return this.processWrite(method, option);
        });
    }

    withdrawStart(amount: TYPE_AMOUNT, option: ITransactionOption = {}) {
        this.checkForChild("withdrawStart");

        if (this.contractParam.address === MATIC_TOKEN_ADDRESS_ON_POLYGON) {
            option.value = Converter.toHex(amount);
        }
        return this.getContract().then(tokenContract => {
            const method = tokenContract.method(
                "withdraw",
                Converter.toHex(amount)
            );
            return this.processWrite(method, option);
        });
    }

    private withdrawConfirm_(burnTxHash: string, isFast: boolean, option: ITransactionOption) {
        this.checkForRoot("withdrawConfirm");

        return Promise.all([
            this.getPredicate(),
            this.getHelperContracts().exitUtil.buildPayloadForExit(
                burnTxHash,
                Plasma_Log_Event_Signature.Erc20WithdrawEventSig,
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

    withdrawConfirm(burnTxHash: string, option?: ITransactionOption) {
        return this.withdrawConfirm_(burnTxHash, false, option);
    }

    withdrawConfirmFaster(burnTxHash: string, option?: ITransactionOption) {
        return this.withdrawConfirm_(burnTxHash, true, option);
    }

    transfer(amount: TYPE_AMOUNT, to: string, option: ITransactionOption = {}) {
        if (this.contractParam.address === MATIC_TOKEN_ADDRESS_ON_POLYGON) {
            option.to = to;
            option.value = Converter.toHex(amount);
            return this.sendTransaction(option);
        }
        return this.transferERC20(to, amount, option);
    }
}
