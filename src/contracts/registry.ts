import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";


export class RegistryContract extends BaseToken {

    constructor(client: Web3SideChainClient, address: string) {
        super(
            {
                isParent: true,
                address: address,
                name: "Registry"
            },
            client
        );
    }

}