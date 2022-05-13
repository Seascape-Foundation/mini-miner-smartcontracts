var MinerNFTFactory = artifacts.require("./MinerNFTFactory.sol");
// var OreNft = artifacts.require("./OreNft.sol");


let _minerTransaction = "0x5a20372B6a1bC8E612f8128afc5BD01AecbaC52f";

module.exports = async function(deployer, network) {
   
        await deployer.deploy(MinerNFTFactory, _minerTransaction).then(function(){
            console.log("MinerNFTFactory contract was deployed at address: "+ MinerNFTFactory.address);
        });
};


//bsctestnet address: 0xCeE733CA0fF7e1F7Ea276734051C23CA46547e34