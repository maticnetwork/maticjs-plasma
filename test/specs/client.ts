import { PlasmaClient } from "@maticnetwork/maticjs-plasma";
import { user1, rpc, plasma, user2 } from "../config";

export const privateKey = user1.privateKey;
export const from = user1.address;

export const to = user2.address;
export const toPrivateKey = user2.privateKey;

export const erc20 = {
    parent: plasma.parent.erc20,
    child: plasma.child.erc20
}
export const erc721 = {
    parent: plasma.parent.erc721,
    child: plasma.child.erc721
}

export const RPC = rpc;

console.log('from', from, from.length, privateKey.length);

export const plasmaClient = new PlasmaClient();
export const plasmaClientTo = new PlasmaClient();

