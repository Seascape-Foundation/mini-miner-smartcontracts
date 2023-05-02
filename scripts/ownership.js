let MinerGame = artifacts.require("MinerGame");
let MineNft    = artifacts.require("MineNFT");
let NftFactory    = artifacts.require("MineNFTFactory");

module.exports = async function(callback) {
    res = await ownership();
    callback(null, res);
};

// Checks the owners of the smartcontracts
let ownership = async function() {
    accounts = await web3.eth.getAccounts();
    let gameOwner = accounts[0];
    console.log(`signer: ${gameOwner}`);

    // // bsctestnet
    let minerGameAddress = "0x8E0209a60D0C89027A6390115323A896B51C96a0";
    let nftAddress = "0x63E953B5f969cb69C7F3B4f218CAb99da524eDDa";
    let nftFactoryAddress = "0xA4b1D1a7f597B450154B95C7F4DD31a9a3A3BAd2";

    //--------------------------------------------------------------

    console.log("Loading contracts...");
    let minerGame = await MinerGame.at(minerGameAddress);
    let mineNft   = await MineNft.at(nftAddress);
    let nftFactory= await NftFactory.at(nftFactoryAddress);
    console.log(`Contracts loaded!`);

    // ----------------------check the owners------------------------------------

    try{
    	console.log(`Checking owners...`);
    	let minerGameOwner = await minerGame.owner();
    	let mineNftOwner = await mineNft.owner();
    	let gameOwnerAdmin = await nftFactory.isAdmin(gameOwner);

        console.log(`Owners returned:`);
        console.log(`MinerGame:       ${minerGameOwner}`);
        console.log(`MineNFT:         ${mineNftOwner}`);
        console.log(`Is ${gameOwner} admin of MineNFTFactory: ${gameOwnerAdmin}`);

        console.log(`\n\nChecking verifier`);
    	let mineNftVerifier = await minerGame.verifier();
        console.log(`Verifiers returned:`);
        console.log(`MinerGame verifier:       ${mineNftVerifier}`);
        console.log(`Is ${gameOwner} is the verifier: ${mineNftVerifier.toLowerCase() == gameOwner.toLowerCase()}`);

        console.log(`\n\nChecking game owner roles in MineNFTFactory...`);
    	let gameOwnerGenerator = await nftFactory.isGenerator(gameOwner);
        console.log(`Roles checked:`);
        console.log(`Is ${gameOwner} is generator ${gameOwnerGenerator}`);

        console.log(`\n\nChecking linked mine nft`);
    	let mineNftInGame = await minerGame.mineNft();
        console.log(`Mine NFT returned:`);
        console.log(`MineNFT in the game contract:       ${mineNftInGame}`);

        console.log(`\n\nChecking approved user for nft`);
        let nftId = 80;
        let approvedNft80 = await mineNft.getApproved(nftId);
        let ownerNft80 = await mineNft.ownerOf(nftId);
        console.log(`Mine NFT 80 approved user returned:`);
        console.log(`Approved for:       ${approvedNft80}`);
        console.log(`Owner:              ${ownerNft80}`);
             
    } catch(e) {
    	console.error(e);
        return;
	}
    console.log("All tested!");
}.bind(this);
