import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";
import { IPlasmaClientConfig } from "../interfaces";

export class DepositManager extends BaseToken<IPlasmaClientConfig>{

    constructor(client: Web3SideChainClient<IPlasmaClientConfig>, address: string) {
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