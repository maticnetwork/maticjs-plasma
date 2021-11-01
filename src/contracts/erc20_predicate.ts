import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";
import { IPlasmaClientConfig } from "../interfaces";


export class ErcPredicate extends BaseToken<IPlasmaClientConfig>{

    constructor(client: Web3SideChainClient<IPlasmaClientConfig>, address: string, contractName: string) {
        super(
            {
                isParent: true,
                address: address,
                name: contractName
            },
            client
        );
    }

}