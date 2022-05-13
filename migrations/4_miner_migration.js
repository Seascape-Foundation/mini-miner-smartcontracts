var MinerGame = artifacts.require("./MinerGame.sol");

let rewardToken = "0x4Ca0ACab9f6B9C084d216F40963c070Eef95033B";
let nft   = "0x5a20372B6a1bC8E612f8128afc5BD01AecbaC52f";
let verifier = "0xc6ef8a96f20d50e347ed9a1c84142d02b1efedc0";


module.exports = function(deployer, network) {
    deployer.deploy(MinerGame, rewardToken, nft, verifier).then(function(){
	    console.log("MinerGame was deployed at address: "+ MinerGame.address);
    });
};
 
