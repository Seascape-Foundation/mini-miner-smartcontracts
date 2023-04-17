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
    api_keys: {
      testnet_polygonscan: ''
    },
    networks: {
      bsctestnet: {
        provider: () => new HDWalletProvider(process.env.ACCOUNT_1,"https://data-seed-prebsc-2-s1.binance.org:8545"), 
        network_id: 97,
        enabled: true,
        runs: 200
      },
      mumbai: {
        provider: () => new HDWalletProvider(process.env.ACCOUNT_1,
          ""), 
        network_id: 80001,
        enabled: true,
        runs: 200
      },
    }
};
