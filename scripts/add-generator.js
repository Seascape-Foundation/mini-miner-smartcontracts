let MineNFTFactory    = artifacts.require("MineNFTFactory");

module.exports = async (callback) => {
    let res = await addGenerator();
    callback(null, res);
};

let addGenerator = async () => {
    accounts = await web3.eth.getAccounts();
    console.log(`signer: ${accounts[0]}`);
    let generator = accounts[0];

    // // mumbai testnet
    // let factoryAddress = "0x62114c4c2125aeb7fbbfdc39b653ca55fc360531";
    const factoryAddress = MineNFTFactory.address;
    if (!factoryAddress) {
        throw `Missing MineNFTFactory.address`
    }

    //--------------------------------------------------------------

    console.log("Loading contracts...");
    let nftFactory= await MineNFTFactory.at(factoryAddress);
    console.log(`Contracts loaded`);

    console.log(`Checking has the ${generator} permission to mint...`);
    let isGenerator = await nftFactory.isGenerator(generator);
    if(!isGenerator) {
        console.log(`The ${generator} doesn't have permission. Adding it as Generator`);
        await nftFactory.addGenerator(generator);
        console.log(`The ${generator} added as Generator`);
    } else {
        console.log(`The ${generator} is a Generator already!`);
    }

    return true;
};
