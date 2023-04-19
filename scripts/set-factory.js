let MinerGame = artifacts.require("MinerGame");
let ERC20 = artifacts.require("ERC20");
let MineNFT    = artifacts.require("MineNFT");
let MineNFTFactory    = artifacts.require("MineNFTFactory");

module.exports = async (callback) => {
    let res = await setFactory();
    callback(null, res);
};

let setFactory = async () => {
    accounts = await web3.eth.getAccounts();
    console.log(`signer: ${accounts[0]}`);

    // // mumbai testnet
    // let nftAddress = "0x10274371822035ae986E9315505bA1aa20472eaE";
    // let factoryAddress = "0x62114c4c2125aeb7fbbfdc39b653ca55fc360531";
    const nftAddress = MineNFT.address;
    if (!nftAddress) {
        throw `Missing MineNFT.address`
    }
    const factoryAddress = MineNFTFactory.address;
    if (!factoryAddress) {
        throw `Missing MineNFTFactory.address`
    }

    //--------------------------------------------------------------

    console.log("Loading contracts...");
    let mineNft   = await MineNFT.at(nftAddress);
    console.log(`Contracts loaded`);

    console.log(`Setting factory in MineNFT`);
    await mineNft.setFactory(factoryAddress);
    console.log(`Factery set successfully`);

    console.log(`Now you need add the accounts to MineNFTFactory that could mint nfts`);
    console.log(`In order to add the deployer as the minter call:`);
    console.log(`\ttruffle exec scripts/add-generator.js --network <network name>`);

    return true;
};
