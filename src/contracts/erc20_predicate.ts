import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";


export class ErcPredicate extends BaseToken {

    constructor(client: Web3SideChainClient, address: string, contractName: string) {
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