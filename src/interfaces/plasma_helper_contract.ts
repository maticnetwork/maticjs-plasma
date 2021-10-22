import { ExitUtil } from "@maticnetwork/maticjs";
import { DepositManager, RegistryContract, WithdrawManager } from "../contracts";

 

export interface IPlasmaContracts {
    depositManager: DepositManager;
    registry: RegistryContract;
    exitUtil: ExitUtil;
    withdrawManager: WithdrawManager;
}