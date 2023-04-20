let MinerGame = artifacts.require("MinerGame");
let ERC20 = artifacts.require("ERC20");
let MineNft    = artifacts.require("MineNFT");
let NftFactory    = artifacts.require("MineNFTFactory");

module.exports = async function(callback) {
    res = await importNft();
    callback(null, res);
};

let importNft = async function() {
    console.log();
    accounts = await web3.eth.getAccounts();
    console.log(`signer: ${accounts[0]}`);
    let gameOwner = accounts[0];
    let verifierAddress = gameOwner;

    // mumbai testnet
    let minerGameAddress = MinerGame.address;
    if (!minerGameAddress) {
        minerGameAddress = "0x9B572C09c2f86643e67B4e94f27528870613cc7E";
    }

    //--------------------------------------------------------------

    console.log("Loading contracts...");
    let minerGame = await MinerGame.at(minerGameAddress);
    console.log(`Contracts loaded!`);


    console.log(`Prepare parameters`);
    let playerAddress = "0xa2de641d27069a8225192048f69a0694529357cf";
    const nftId = 1;
    const tokenWei = web3.utils.toWei("5", "ether");
    const nonce = await minerGame.nonce(playerAddress);
    const chainId = await web3.eth.net.getId();

    console.log(`Prepare the encoded parameters`);
    const bytes1 = web3.eth.abi.encodeParameters(['uint256'], [nftId.toString()]);
    const bytes2 = web3.eth.abi.encodeParameters(['uint256'], [parseInt(nonce.toString(), 10)]);
    console.log(`Parameters prepared!`);

    console.log(`Sign`);
    const str =
        bytes1 +
        playerAddress.substring(2) +
        minerGameAddress.substring(2) +
        bytes2.substring(2);
    const data = web3.utils.keccak256(str);

    const signature = await web3.eth.sign(data, verifierAddress);

    console.log(`Player:       ${playerAddress}`);
    console.log(`nft id:     ${chainId}`);
    console.log(`nonce:        ${nonce}`);
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
}.bind(this);
