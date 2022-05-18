var MinerGame = artifacts.require("./MinerGame.sol");
var Crowns    = artifacts.require("./CrownsToken.sol");
var MinerTransaction = artifacts.require("./MinerTransaction.sol");

// let rewardToken = "0x4Ca0ACab9f6B9C084d216F40963c070Eef95033B";
// let nft   = "0xd17cC3B9cC4daF26eBfbA01DA082a75086E1fC87";
// let verifier = "0xc6ef8a96f20d50e347ed9a1c84142d02b1efedc0";


// module.exports = function(deployer, network) {
//     deployer.deploy(MinerGame, rewardToken, nft, verifier).then(function(){
// 	    console.log("MinerGame was deployed at address: "+ MinerGame.address);
//     });
// };

async function getAccount(id) {
    let accounts = await web3.eth.getAccounts();
    return accounts[id];
}

module.exports = async function(deployer, network) {
    var verifier = await getAccount(2);

    // console.log(verifier);
    await deployer.deploy(MinerGame, Crowns.address, MinerTransaction.address, verifier).then(function(){
        console.log("MinerGame was deployed at address: "+ MinerGame.address);
    });
};
 
