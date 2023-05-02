let MineNft    = artifacts.require("MineNFT");
let NftFactory    = artifacts.require("MineNFTFactory");

module.exports = async function(callback) {
    res = await mintNft();
    callback(null, res);
};

let mintNft = async function() {
    accounts = await web3.eth.getAccounts();
    console.log(`signer: ${accounts[0]}`);
    let gameOwner = accounts[0];

    // // bsctestnet
    let nftFactoryAddress = "0xA4b1D1a7f597B450154B95C7F4DD31a9a3A3BAd2";

    //--------------------------------------------------------------

    console.log("Loading contracts...");
    let nftFactory= await NftFactory.at(nftFactoryAddress);
    console.log(`Contracts are loaded!`);


    let amount = 2;
    let generation = 0;
    let quality = 1;
    let owner = "0x365803F838f4dfCe91c98ED5837eB2f303BD3929";
    console.log(`Minting ${amount} nfts for ${owner} by ${gameOwner}`);
    for (let i = 1; i <= amount; i++) {
        try{
            console.log(`Minting #${i} Quality ${quality}, Generation ${generation} for ${owner}`);
            await nftFactory.mint(owner, generation, quality);
            console.log(`NFT #${i} minted!`);
            
            generation++;
            quality++;
        }catch(e){
            console.log(e);
        }
    }

    console.log("Minted!");

}.bind(this);