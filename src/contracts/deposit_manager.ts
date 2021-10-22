import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";

export class DepositManager extends BaseToken {

    constructor(client: Web3SideChainClient, address: string) {
        super(
            {
                isParent: true,
                address: address,
                name: "DepositManager"
            },
            client
        );
    }

    get address() {
        return this.contractParam.address;
    }

}