var MinerTransaction = artifacts.require("./MinerTransaction.sol");

module.exports = async function(deployer, network) {
   
        await deployer.deploy(MinerTransaction).then(function(){
            console.log("MinerTransaction contract was deployed at address: "+ MinerTransaction.address);
        });
};