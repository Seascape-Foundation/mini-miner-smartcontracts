var MineNFTFactory  = artifacts.require("./MineNFTFactory.sol");
var MineNFT = artifacts.require("./MineNFT.sol");


module.exports = async function(deployer, network) {
   
        await deployer.deploy(MineNFTFactory, MineNFT.address).then(function(){
            console.log("MineNFTFactory contract was deployed at address: "+ MineNFTFactory.address);
        });
};