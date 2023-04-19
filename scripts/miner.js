let MinerGame = artifacts.require("MinerGame");
let ERC20 = artifacts.require("ERC20");
let MineNft    = artifacts.require("MineNFT");
let NftFactory    = artifacts.require("MineNFTFactory");

module.exports = async function(callback) {
    let res = await generateBuyItemSignature();
    // let res = await approveAhmetsonToken();
    callback(null, res);
};

let approveAhmetsonToken = async function() {
    accounts = await web3.eth.getAccounts();
    console.log(`signer: ${accounts[0]}`);

    // mumbai testnet
    let testToken = "0x25736b717735d6cB3318d406F88A1A38a614E49b";
    let minerGameAddress = "0x25315456438f60cd3752a701c6d4e374eafc6866";

    //--------------------------------------------------------------

    console.log("Loading contracts...");
    let token = await ERC20.at(testToken);
    console.log(`Smartcontracts loaded`);

    console.log(`Prepare parameters`);
    const tokenWei = web3.utils.toWei("10000", "ether");
    
    console.log(`Approving...`);
    await token.approve(minerGameAddress, tokenWei);
    console.log(`Approved!`);
    return true;
}.bind(this);

let generateBuyItemSignature = async function() {
    accounts = await web3.eth.getAccounts();
    console.log(`signer: ${accounts[0]}`);
    let gameOwner = accounts[0];
    let verifierAddress = gameOwner;

    // mumbai testnet
    let minerGameAddress = "0x9B572C09c2f86643e67B4e94f27528870613cc7E";

    //--------------------------------------------------------------

    console.log("Loading contracts...");
    let minerGame = await MinerGame.at(minerGameAddress);
    let playerAddress = "0xa2dE641D27069A8225192048f69A0694529357CF";
    console.log(`Smartcontracts loaded`);

    console.log(`Prepare parameters`);
    const packId = 1;
    const tokenWei = web3.utils.toWei("5", "ether");
    const nonce = await minerGame.nonce(playerAddress);
    const chainId = await web3.eth.net.getId();

    console.log(`Prepare the encoded parameters`);
    const bytes1 = web3.eth.abi.encodeParameters(['uint256'], [web3.utils.toBN(tokenWei.toString())]);
    const bytes2 = web3.eth.abi.encodeParameters(['uint256'], [parseInt(nonce.toString(), 10)]);
    const bytes3 = web3.eth.abi.encodeParameters(['uint256'], [parseInt(chainId.toString(), 10)]);
    const bytes4 = web3.eth.abi.encodeParameters(['uint256'], [parseInt(packId.toString(), 10)]);
    console.log(`Parameters prepared!`);

    console.log(`Sign`);
    const str =
        bytes1 +
        playerAddress.substring(2) +
        bytes2.substring(2) +
        minerGameAddress.substring(2) +
        bytes3.substring(2) +
        bytes4.substring(2); 
    const data = web3.utils.keccak256(str);

    const signature = await web3.eth.sign(data, verifierAddress);

    console.log(`Player:       ${playerAddress}`);
    console.log(`chain id:     ${chainId}`);
    console.log(`nonce:        ${nonce}`);
    console.log(`token amount: ${tokenWei}`);
    console.log(`pack id:      ${packId}`);
    console.log(`generated signature: ${signature}`);

    // v,r,s
    const r = signature.substr(0, 66);
    const s = `0x${signature.substr(66, 64)}`;
    let v = parseInt(signature.substr(130), 16);
    if (v < 27) {
        v += 27;
    }
    console.log(`v: ${v}\nr: ${r}\ns: ${s}`);

    return { signature };

    try{

        console.log(`nft add factory!!!!`);
        await mineNft.setFactory(nftFactoryAddress);
        

        console.log(`factory add Generator!!!!`);
        let isGenerator = await nftFactory.isGenerator(gameOwner);
        if(!isGenerator) {
            await nftFactory.addGenerator(gameOwner);
        }

    }catch(e){
        console.log(e);
    }
    console.log("factory fine");

}.bind(this);

let approveTokens = async function() {
    accounts = await web3.eth.getAccounts();
    console.log(`signer: ${accounts[0]}`);
    let gameOwner = accounts[0];

    // //moonbase
    // let mscpAddress = "0xF2C84Cb3d1e9Fac001F36c965260aA2a9c9D822D";
    // let cwsAddress  = "0xFde9cad69E98b3Cc8C998a8F2094293cb0bD6911";
    // let ribAddress  = "0xE29A4BD665e4782a4c002aA30D3d25f010E8A394";
    // let devAddress  = "0x0000000000000000000000000000000000000000";


    // let minerGameAddress   = "0xdd23e96d093C8803EAb914d68b5215c00DA02efd";

    // let OreNftAddress = "0x4491Ce192d84330Ad4FeF0318d2Fed9be22e963B";
    // let OreNftFactoryAddress = "0x9507379bB5d8b2407dE368c8bb2bF6B88f2e07e2";


    // // bsctestnet
    // let usdcAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    // let cwsAddress = "0x4Ca0ACab9f6B9C084d216F40963c070Eef95033B";

    // let nftAddress = "0x5a20372B6a1bC8E612f8128afc5BD01AecbaC52f";
    // let nftFactoryAddress = "0xCeE733CA0fF7e1F7Ea276734051C23CA46547e34";

    // mumbai testnet
    let nftAddress = "0x10274371822035ae986E9315505bA1aa20472eaE";
    let nftFactoryAddress = "0x62114c4c2125aeb7fbbfdc39b653ca55fc360531";


    //--------------------------------------------------------------

    console.log("Loading contracts...");
    let minerGame = await MinerGame.at(minerGameAddress);
    let mineNft   = await MineNft.at(nftAddress);
    let nftFactory= await NftFactory.at(nftFactoryAddress);

    // ----------------------approve start------------------------------------

    //     console.log("loading token contracts...");
    // 	let usdc = await ERC20.at(usdcAddress);
    // 	let cws  = await ERC20.at(cwsAddress);

    // 	try{
    // 		let approveAmount = web3.utils.toWei("100000000","ether");
            
    // 		console.log(`cws approve MinerGame：${minerGameAddress} start`);
    // 		await cws.approve(minerGameAddress, approveAmount);

    //         console.log(`usdc approve MinerGame：${minerGameAddress} start`);
    //         await usdc.approve(minerGameAddress, approveAmount);

    //         console.log("nft setApprovalForAll minerGame start");
    //         await oreNft.setApprovalForAll(minerGameAddress, true);
    //         console.log("nft setApprovalForAll minerGame finished");

    // 	}catch(e){
    // 		console.log(e);
    // 	}
    // 	console.log("approve fine");


    try{

        console.log(`nft add factory!!!!`);
        await mineNft.setFactory(nftFactoryAddress);
        

        console.log(`factory add Generator!!!!`);
        let isGenerator = await nftFactory.isGenerator(gameOwner);
        if(!isGenerator) {
            await nftFactory.addGenerator(gameOwner);
        }

    }catch(e){
        console.log(e);
    }
    console.log("factory fine");

}.bind(this);

let mintNfts = async function() {
    accounts = await web3.eth.getAccounts();
    console.log(`signer: ${accounts[0]}`);
    let gameOwner = accounts[0];

    // //moonbase
    // let nftAddress = "0x4491Ce192d84330Ad4FeF0318d2Fed9be22e963B";
    // let nftFactoryAddress = "0x9507379bB5d8b2407dE368c8bb2bF6B88f2e07e2";

    // // bsctestnet
    // let nftAddress = "0x5a20372B6a1bC8E612f8128afc5BD01AecbaC52f";
    // let nftFactoryAddress = "0xCeE733CA0fF7e1F7Ea276734051C23CA46547e34";

    // mumbai testnet
    let nftAddress = "0x10274371822035ae986E9315505bA1aa20472eaE";
    let nftFactoryAddress = "0x62114c4c2125aeb7fbbfdc39b653ca55fc360531";


    //--------------------------------------------------------------

    console.log("Loading contracts...");
    let mineNft   = await MineNft.at(nftAddress);
    let nftFactory= await NftFactory.at(nftFactoryAddress);
    console.log(`Smartcontracts are loaded!`);

    console.log(`MineNFT gives permission to the factory`);

    try{

        console.log(`nft add factory!!!!`);
        await mineNft.setFactory(nftFactoryAddress);
        

        console.log(`factory add Generator!!!!`);
        let isGenerator = await nftFactory.isGenerator(gameOwner);
        if(!isGenerator) {
            await nftFactory.addGenerator(gameOwner);
        }

    }catch(e){
        console.log(e);
    }
    console.log("factory fine");

}.bind(this);