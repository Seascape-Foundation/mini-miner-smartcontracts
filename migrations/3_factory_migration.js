var MinerNFTFactory  = artifacts.require("./MinerNFTFactory.sol");
var MinerTransaction = artifacts.require("./MinerTransaction.sol");


// let _minerTransaction = "0x55dB2CEA7AcF1bCa8FbfbB93B732BDc1d3A3ebce";

module.exports = async function(deployer, network) {
   
        await deployer.deploy(MinerNFTFactory, MinerTransaction.address).then(function(){
            console.log("MinerNFTFactory contract was deployed at address: "+ MinerNFTFactory.address);
        });
};