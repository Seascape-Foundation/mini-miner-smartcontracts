var MineNFT = artifacts.require("./MineNFT.sol");

module.exports = async function(deployer, network) {
    console.log(`Deploying MineNFT on ${network} network`);
    await deployer.deploy(MineNFT);
    console.log(`MineNFT was deployed at ${MineNFT.address}`);
};