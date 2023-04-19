var MinerGame = artifacts.require("./MinerGame.sol");
var MineNFT = artifacts.require("./MineNFT.sol");
var MineNFTFactory = artifacts.require("./MineNFTFactory.sol");

// let rewardToken = "0x4Ca0ACab9f6B9C084d216F40963c070Eef95033B";
// let nft   = "0xd17cC3B9cC4daF26eBfbA01DA082a75086E1fC87";
// let verifier = "0xc6ef8a96f20d50e347ed9a1c84142d02b1efedc0";


// module.exports = function(deployer, network) {
//     deployer.deploy(MinerGame, rewardToken, nft, verifier).then(function(){
// 	    console.log("MinerGame was deployed at address: "+ MinerGame.address);
//     });
// };

module.exports = async function(deployer, network) {
    let accounts = await web3.eth.getAccounts();
    let signer= accounts[0];
    console.log(`Signer: ${signer}`);
    let token = "0x25736b717735d6cB3318d406F88A1A38a614E49b";
    let nft = MineNFT.address;
    if (!nft) {
        throw `Missing MineNFT.address`
    }
    let factory = MineNFTFactory.address;
    if (!factory) {
        throw `Missing MineNFTFactory.address`
    }

    let verifier = accounts[0];
    let bank = accounts[0];
    let vault = accounts[0];

    console.log(`Deploying MinerGame on ${network} network`);
    console.log(`The constructor parameters are:`);
    console.log(`\t_token:    ${token}`);
    console.log(`\t_nft:       ${nft}`);
    console.log(`\t_factory:  ${factory}`);
    console.log(`\t_verifier: ${verifier}`);
    console.log(`\t_bank:     ${bank}`);
    console.log(`\t_vault:    ${vault}`);
    await deployer.deploy(MinerGame, token, nft, factory, verifier, bank, vault); 
    console.log(`MinerGame was deployed on ${MinerGame.address}`);
    console.log(`Now install truffle-plugin-verify and verify smartcontracts on explorer`);
    console.log(`See documentation to setup parameters: https://www.npmjs.com/package/truffle-plugin-verify`);
    console.log(`Finally run:`);
    console.log(`\ttruffle run verify MineNFT MineNFTFactory MinerGame --network ${network}`);
};
 
