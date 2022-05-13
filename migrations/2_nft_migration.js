var MinerTransaction = artifacts.require("./MinerTransaction.sol");

module.exports = async function(deployer, network) {
   
        await deployer.deploy(MinerTransaction).then(function(){
            console.log("MinerTransaction contract was deployed at address: "+ MinerTransaction.address);
        });
};


//bsctestnet address: 0x5a20372B6a1bC8E612f8128afc5BD01AecbaC52f;