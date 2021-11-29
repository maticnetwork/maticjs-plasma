import { from, plasmaClient, plasmaClientTo, privateKey, RPC, to, toPrivateKey } from "./client";
import HDWalletProvider from "@truffle/hdwallet-provider";


describe('Plasma Client', () => {

    it('initiate plasma client from', async () => {
        await plasmaClient.init({
            // log: true,
            network: 'testnet',
            version: 'mumbai',
            parent: {
                provider: new HDWalletProvider(privateKey, RPC.parent),
                defaultConfig: {
                    from: from
                }
            },
            child: {
                provider: new HDWalletProvider(privateKey, RPC.child),
                defaultConfig: {
                    from: from
                }
            }
        })
    })

    it('initiate plasma client to', async () => {
        await plasmaClientTo.init({
            // log: true,
            network: 'testnet',
            version: 'mumbai',
            parent: {
                provider: new HDWalletProvider(toPrivateKey, RPC.parent),
                defaultConfig: {
                    from: to
                }
            },
            child: {
                provider: new HDWalletProvider(toPrivateKey, RPC.child),
                defaultConfig: {
                    from: to
                }
            }
        })
    });
});
