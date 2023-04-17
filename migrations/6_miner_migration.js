var MinerGame = artifacts.require("./MinerGame.sol");
var Crowns    = artifacts.require("./CrownsToken.sol");
var MineNFT = artifacts.require("./MineNFT.sol");

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
    await deployer.deploy(
        MinerGame, 
        "0x25736b717735d6cB3318d406F88A1A38a614E49b", 
        "0x10274371822035ae986E9315505bA1aa20472eaE", 
        "0x62114C4c2125aEb7FbBfdc39b653cA55fc360531", 
        "0x5bded8f6bdae766c361edae25c5dc966bcaf8f43", 
        "0x5bded8f6bdae766c361edae25c5dc966bcaf8f43", 
        "0x5bded8f6bdae766c361edae25c5dc966bcaf8f43").then(function(){
        console.log("MinerGame was deployed at address: "+ MinerGame.address);
    });
};
 
