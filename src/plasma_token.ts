import { IPlasmaClientConfig, IPlasmaContracts } from "./interfaces";
import { BaseToken, promiseResolve, Web3SideChainClient, BaseContract, IContractInitParam, ITransactionOption } from "@maticnetwork/maticjs";
import { ErcPredicate } from "./contracts";

export class PlasmaToken extends BaseToken<IPlasmaClientConfig> {

    private predicate_: BaseContract;


    constructor(
        contractParam_: IContractInitParam,
        client: Web3SideChainClient<IPlasmaClientConfig>,
        protected contracts_: IPlasmaContracts
    ) {
        super(contractParam_, client);
    }

    protected getPredicate_(methodName: string, contractName: string, predicateAddress: string): Promise<BaseContract> {
        if (this.predicate_) {
            return promiseResolve(this.predicate_);
        }
        const getPredicateAddress = () => {
            if (predicateAddress) {
                return promiseResolve<string>(predicateAddress);
            }
            return this.contracts_.registry.getContract().then(contract => {
                return contract.method(
                    methodName
                ).read<string>();
            });
        };
        getPredicateAddress().then(address => {
            return new ErcPredicate(
                this.client,
                address,
                contractName
            ).getContract();
        }).then(contract => {
            this.predicate_ = contract;
            return contract;
        });
    }

    withdrawExit(option?: ITransactionOption) {
        return this.contracts_.withdrawManager.withdrawExit(
            this.contractParam.address, option
        );
    }

}