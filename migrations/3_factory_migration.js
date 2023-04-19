var MineNFTFactory  = artifacts.require("./MineNFTFactory.sol");
var MineNFT = artifacts.require("./MineNFT.sol");


module.exports = async function(deployer, network) {
    console.log(`Deploying MineNFTFactory on ${network} network for ${MineNFT.address} NFT`);
    deployer.deploy(MineNFTFactory, MineNFT.address)
    console.log(`MineNFTFactory was deployed at ${MineNFTFactory.address}`);
    console.log(`Now add the factory to the MineNFT:`);
    console.log(`\ttruffle exec scripts/set-factory.js --network ${network}`);
};