var MineNFT = artifacts.require("./MineNFT.sol");

module.exports = async function(deployer, network) {
    await deployer.deploy(MineNFT).then(function(){
        console.log("MineNFT contract was deployed at address: "+ MineNFT.address);
    });
};