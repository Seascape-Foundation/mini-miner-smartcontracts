let MinerGame = artifacts.require("MinerGame");
let ERC20 = artifacts.require("ERC20");
let MineNft    = artifacts.require("MinerTransaction");
let NftFactory    = artifacts.require("MinerNFTFactory");

module.exports = async function(callback) {
    console.log("Calling the init function...")
    let res = await init();
    
    callback(null, res);
};

let init = async function() {
    console.log("account is setting..")
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
    let gameOwner = accounts[0];

// //moonbase
// let mscpAddress = "0xF2C84Cb3d1e9Fac001F36c965260aA2a9c9D822D";
// let cwsAddress  = "0xFde9cad69E98b3Cc8C998a8F2094293cb0bD6911";
// let ribAddress  = "0xE29A4BD665e4782a4c002aA30D3d25f010E8A394";
// let devAddress  = "0x0000000000000000000000000000000000000000";


// let minerGameAddress   = "0xdd23e96d093C8803EAb914d68b5215c00DA02efd";

// let OreNftAddress = "0x4491Ce192d84330Ad4FeF0318d2Fed9be22e963B";
// let OreNftFactoryAddress = "0x9507379bB5d8b2407dE368c8bb2bF6B88f2e07e2";


// bsctestnet

let usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
let cwsAddress = "0x4Ca0ACab9f6B9C084d216F40963c070Eef95033B";


let nftAddress = "0x5a20372B6a1bC8E612f8128afc5BD01AecbaC52f";
let nftFactoryAddress = "0xCeE733CA0fF7e1F7Ea276734051C23CA46547e34";

let minerGameAddress = "0x8e627b37290fD9776541356144cCb4ddA4D20a5d";

//--------------------------------------------------------------


    console.log("loading contracts...");
    let minerGame = await MinerGame.at(minerGameAddress);
    let mineNft   = await MineNft.at(nftAddress);
    let nftFactory= await NftFactory.at(nftFactoryAddress);

// //----------------------approve start------------------------------------

    console.log("loading token contracts...");
	let usdc = await ERC20.at(usdcAddress);
	let cws  = await ERC20.at(cwsAddress);

	try{
		let approveAmount = web3.utils.toWei("100000000","ether");
        
		console.log(`cws approve MinerGame：${minerGameAddress} start`);
		await cws.approve(minerGameAddress, approveAmount);

        console.log(`usdc approve MinerGame：${minerGameAddress} start`);
        await usdc.approve(minerGameAddress, approveAmount);

        console.log("nft setApprovalForAll minerGame start");
        await oreNft.setApprovalForAll(minerGameAddress, true);
        console.log("nft setApprovalForAll minerGame finished");

	}catch(e){
		console.log(e);
	}
	console.log("approve fine");


    // try{

    //     console.log(`nft add factory!!!!`);
    //     await mineNft.setFactory(nftFactoryAddress);
        

    //     console.log(`factory add Generator!!!!`);
    //     let isGenerator = await nftFactory.isGenerator(gameOwner);
    //     if(!isGenerator) {
    //         await nftFactory.addGenerator(gameOwner);
    //     }

    // }catch(e){
    //     console.log(e);
    // }
    // console.log("factory fine");

}.bind(this);