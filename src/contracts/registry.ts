import { BaseToken, Web3SideChainClient } from "@maticnetwork/maticjs";
import { IPlasmaClientConfig } from "../interfaces";


export class RegistryContract extends BaseToken<IPlasmaClientConfig> {

    constructor(client: Web3SideChainClient<IPlasmaClientConfig>, address: string) {
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