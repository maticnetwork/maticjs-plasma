import { ERC20 } from "./erc20";
import { ERC721 } from "./erc721";
import { DepositManager, RegistryContract, WithdrawManager } from "./contracts";
import { BridgeClient, ExitUtil, ITransactionOption, RootChain, TYPE_AMOUNT, Web3SideChainClient } from "@maticnetwork/maticjs";
import { IPlasmaClientConfig, IPlasmaContracts } from "./interfaces";
import { MATIC_TOKEN_ADDRESS_ON_POLYGON } from "./constant";

export class PlasmaClient extends BridgeClient {

    private client_: Web3SideChainClient<IPlasmaClientConfig>;

    withdrawManager: WithdrawManager;

    depositManager: DepositManager;
    registry: RegistryContract;
    rootChain: RootChain;


    constructor(config: IPlasmaClientConfig) {
        super();
        this.client_ = new Web3SideChainClient(config);
    }

    init() {
        const client = this.client_;
        let config: IPlasmaClientConfig = client.config;

        return client.init().then(_ => {
            const mainContracts = client.mainPlasmaContracts;
            client.config = config = Object.assign(
                {
                    rootChain: mainContracts.RootChainProxy,
                    registry: mainContracts.Registry,
                    depositManager: mainContracts.DepositManagerProxy,
                    withdrawManager: mainContracts.WithdrawManagerProxy,
                },
                config
            );

            this.rootChain = new RootChain(
                client,
                config.rootChain
            );

            this.registry = new RegistryContract(
                client,
                config.registry,
            );

            this.depositManager = new DepositManager(
                client,
                config.depositManager
            );

            this.exitUtil = new ExitUtil(
                client.child,
                this.rootChain,
                config.requestConcurrency
            );

            this.withdrawManager = new WithdrawManager(
                client,
                config.withdrawManager,
            );

            return this;
        });
    }

    private getContracts__() {
        return {
            depositManager: this.depositManager,
            exitUtil: this.exitUtil,
            registry: this.registry,
            withdrawManager: this.withdrawManager
        } as IPlasmaContracts;
    }

    erc20(tokenAddress: string, isParent?: boolean) {
        tokenAddress = tokenAddress == null && !isParent ?
            MATIC_TOKEN_ADDRESS_ON_POLYGON : tokenAddress;

        return new ERC20(
            tokenAddress,
            isParent,
            this.client_,
            this.getContracts__()
        );
    }

    erc721(tokenAddress: string, isParent?: boolean) {
        return new ERC721(
            tokenAddress,
            isParent,
            this.client_,
            this.getContracts__()
        );
    }

    withdrawExit(tokens: string | string[], option?: ITransactionOption) {
        return this.withdrawManager.withdrawExit(
            tokens, option
        );
    }

    depositEther(amount: TYPE_AMOUNT, option: ITransactionOption) {
        return new ERC20(
            '', true, this.client_,
            this.getContracts__()
        )['depositEther__'](amount, option);
    }

}
