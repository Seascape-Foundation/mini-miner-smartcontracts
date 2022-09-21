var MineNFT = artifacts.require("./MineNFT.sol");
var Seascape   = require("seascape");

module.exports = async function(deployer, network) {
   
        await deployer.deploy(MineNFT).then(function(){
            console.log("MineNFT contract was deployed at address: "+ MineNFT.address);
        });

        // then updating the CDN
        // project name is greeter
        // project environment is beta
        // if the Configuration file wasn't created we create an empty one
        // the last argument is true, if you use https://cdn-temp.seascape.network/ for development.
        // the last argument is false, if you use https://cdn.seascape.network/.
        let projectParams = new Seascape.CdnUtil.ProjectPath('season','beta',true,false);

        // Inside the Configuration file, what is the network id.
        // and smartcontract category
        let smartcontractPath = new Seascape.CdnUtil.SmartcontractPath(await deployer.network_id,'beta');
        
        // smartcontract parameters
        // name of the smartcontract
        // the rest of the parameters are set after truffle deploys the smartcontract
        // address of the smartcontract
        // transaction id of the deployment
        // abi object
        let smartcontract = new Seascape.CdnUtil.SmartcontractParams(
            'MineNFT',
            MineNFT.abi,
            MineNFT.address,
            MineNFT.transactionHash
        );

        // // update the CdnConfig, Abi to the Seascape CDN
        console.log(projectParams);
        console.log(smartcontractPath);
        console.log(smartcontract);
        let cdnUpdated = await Seascape.CdnWrite.setSmartcontract(projectParams,smartcontractPath,smartcontract);

        if (cdnUpdated) {
            console.log(`CDN was updated successfully`);
        } else {
            console.log(`CDN update failed. Please upload upload it manually!`);
        }
};