var HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
    plugins: [
        'truffle-plugin-verify'
    ],
    compilers: {
		solc: {
	    	version: "0.6.7"
		}
    },
    networks: {
      // development: {
      //   host: "local-node",
      //   port: 8545,
      //   network_id: "*" // Match any network id
      // },
      ganache: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "*" // Match any network id
      },
      // moonbase: {
      //   provider: () => new HDWalletProvider({
      //     // privateKeys: [""],
      //     // privateKeys: [""],
      //     privateKeys: [""],
      //     providerOrUrl: "https://rpc.api.moonbase.moonbeam.network",
      //   }),
      //   network_id: 1287
      // },
      // moonbeam: {
      //   provider: function() {
      //     return new HDWalletProvider({
      //       privateKeys: [""],
      //       providerOrUrl: "https://rpc.api.moonbeam.network",
      //     })
      //   },
      //     gas: 15000000,
      //     gasPrice: 25000000000,
      //     network_id:1284
      // },
      bsctestnet: {
        provider: () => new HDWalletProvider(process.env.ACCOUNT_1,"https://data-seed-prebsc-2-s1.binance.org:8545"), 
        network_id: 97,
        enabled: true,
        runs: 200
        // confirmations: 10,
        // timeoutBlocks: 2000,
        // skipDryRun: true
      },
      // rinkeby: {
      //   provider: function() {
      //     return new HDWalletProvider({
      //       privateKeys: [],
      //       providerOrUrl: "",
      //       addressIndex: 0
      //     })
      //   }
      // }
    }
};
