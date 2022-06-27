var MineNFT = artifacts.require("./MineNFT.sol");
var Seascape   = require("seascape");

module.exports = async function(deployer, network) {
   
        await deployer.deploy(MineNFT).then(function(){
            console.log("MineNFT contract was deployed at address: "+ MineNFT.address);
        });

    //      let truffleParams = {
    //     projectName: 'season',
    //     projectEnv: 'beta',

    //     contractName: 'MineNFT',
    //     contractType: 'main',
    //     contractAbi: MineNFT.abi,
    //     contractAddress: MineNFT.address,
        
    //     networkId: await deployer.network_id,
    //     txid: MineNFT.transactionHash,
    //     owner: deployer.address,
        
    //     // verifier: "", optionally
    //     // fund: "", optioanlly
    // };

    // let cdnUpdated = await Seascape.CdnWrite.setTruffleSmartcontract(truffleParams);
  
    // if (cdnUpdated) {
    //     console.log(`CDN was updated successfully`);
    // } else {
    //     console.log(`CDN update failed. Please upload it manually!`);
    //     console.log(truffleParams);
    // }
};