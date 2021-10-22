import { BaseToken, ITransactionOption, BaseContractMethod, Web3SideChainClient } from "@maticnetwork/maticjs";


export class WithdrawManager extends BaseToken {

    constructor(client: Web3SideChainClient, address: string) {
        super(
            {
                isParent: true,
                address: address,
                name: "WithdrawManager"
            },
            client
        );
    }

    withdrawExit(tokens: string | string[], option?: ITransactionOption) {
        return this.getContract().then(contract => {
            let method: BaseContractMethod;
            if (Array.isArray(tokens)) {
                method = contract.method("processExitsBatch", tokens);
            }
            else {
                method = contract.method("processExits", tokens);
            }
            return this.processWrite(method, option);
        });
    }

}