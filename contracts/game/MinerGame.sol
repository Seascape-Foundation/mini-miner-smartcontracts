// SPDX-License-Identifier: MIT
pragma solidity 0.6.7;

import "./../openzeppelin/contracts/math/SafeMath.sol";
import "./../openzeppelin/contracts/access/Ownable.sol";
import "./../openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./../openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./../openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./../nfts/MineNFT.sol";
import "./../factory/MineNFTFactory.sol";

contract MinerGame is IERC721Receiver, Ownable{

  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  address public mineNft;
  address public rewardToken;
  address public verifier;
  uint256 public typeId;
  uint256 public cooldown;
  address public bank;
  address public vault;

  MineNFTFactory nftFactory;

  struct PlayerParams {
    uint256 nftId;
    uint256 stakeTime;
    uint256 tokenBuyingTime;
  }

  mapping(address => PlayerParams) public player;
  mapping(uint256 => address) public mineOwners;
  mapping(address => bool) public changeAllowed;
  mapping(uint256 => address) public token;
  mapping(address => uint256) public nonce;

  event ImportNft(address indexed owner, uint256 indexed nftId, uint256 time);
  event ExportNft(address indexed owner, uint256 indexed nftId, uint256 time);
  event TokenChangeGold(address indexed owner, uint256 indexed tokenAmount, uint256 time);
  event Withdraw(address indexed tokenAddress, uint256 indexed tokenAmount, address indexed receiver, uint256 time);
  event AddToken(address indexed tokenAddress, uint256 indexed typeId, uint256 time);
  event MintNft(address indexed owner, uint256 indexed generation, uint8 indexed quality, uint256 time);
  event TokenBuyPack(address indexed owner, uint256 typeId, uint256 indexed tokenAmount, uint256 indexed packId, uint256 time);  
  event GoldChangeToken(address indexed owner, uint256 typeId, uint256 indexed tokenAmount, uint256 indexed packId, uint256 time);   

  constructor(address _token, address _nft, address _factory, address _verifier, address _bank, address _vault) public {
    require(_token != address(0), "MinerGame: Token can't be zero address");
    require(_nft != address(0), "MinerGame: Nft can't be zero address");
    require(_verifier != address(0), "MinerGame: Verifier can't be zero address");
    require(_bank != address(0), "MinerGame: Bank can't be zero address");
    require(_vault != address(0), "MinerGame: Vault can't be zero address");

    rewardToken = _token;
    mineNft     = _nft;
    verifier    = _verifier;
    nftFactory  = MineNFTFactory(_factory);
    bank        = _bank;
    vault       = _vault;

    changeAllowed[_token] = true;
    token[typeId]     = _token;

    cooldown = 86400 * 7;     //cooldown time is 7 day
  }

  //stake mine NFT
  function importNft(uint256 _nftId, uint8 _v, bytes32 _r, bytes32 _s) external {
    require(_nftId > 0, "MinerGame: nft Id invalid");

    PlayerParams storage _player = player[msg.sender];
    require(!(_player.nftId > 0), "MinerGame: You've already staked an NFT");

    MineNFT nft = MineNFT(mineNft);
    require(nft.ownerOf(_nftId) == msg.sender, "MinerGame: Not mineNft owner");

    {
      bytes memory prefix     = "\x19Ethereum Signed Message:\n32";
      bytes32 message         = keccak256(abi.encodePacked(_nftId, msg.sender, address(this), nonce[msg.sender]));
      bytes32 hash            = keccak256(abi.encodePacked(prefix, message));
      address recover         = ecrecover(hash, _v, _r, _s);

      require(recover == verifier, "MinerGame: Verification failed about importNft");
    }

    nft.safeTransferFrom(msg.sender, address(this), _nftId);

    nonce[msg.sender]++;

    _player.nftId = _nftId;
    _player.stakeTime = block.timestamp;

    mineOwners[_nftId] = msg.sender;

    emit ImportNft(msg.sender, _nftId, block.timestamp);
  }

  //unstake mine NFT
  function exportNft(uint256 _nftId) external {
    require(mineOwners[_nftId] == msg.sender, "MinerGame: Not the owner");

    MineNFT nft = MineNFT(mineNft);

    PlayerParams storage _player = player[msg.sender];
    delete _player.nftId;
    delete _player.stakeTime;

    delete mineOwners[_nftId];

    emit ExportNft(msg.sender, _nftId, block.timestamp);    
    nft.safeTransferFrom(address(this), msg.sender, _nftId);    
  }

  //token buy gold
  function tokenChangeGold(uint256 _typeId, uint256 _amount) external {
    require(_amount > 0, "MinerGame: The exchange amount can't be 0");
    require(checkToken(_typeId), "MinerGame: Do not have this token type");

    IERC20 _token = IERC20(token[_typeId]); 
    require(_token.balanceOf(msg.sender) >= _amount, "MinerGame: Not enough token to stake");
    
    _token.safeTransferFrom(msg.sender, bank, _amount);

    emit TokenChangeGold(msg.sender, _amount, block.timestamp);     
  }

  //token buy pack
  function tokenBuyPack(uint256 _typeId, uint256 _amount, uint256 _packId, uint8 _v, bytes32 _r, bytes32 _s) external{
    require(_amount > 0, "MinerGame: The token amount must greater than zero");
    require(checkToken(_typeId), "MinerGame: Do not have this token type");

    IERC20 _token = IERC20(token[_typeId]); 

    uint256 chainId;   
    assembly {
        chainId := chainid()
    } 

    {
      bytes memory prefix     = "\x19Ethereum Signed Message:\n32";
      bytes32 message         = keccak256(abi.encodePacked(_amount, msg.sender, nonce[msg.sender], address(this), chainId, _packId));
      bytes32 hash            = keccak256(abi.encodePacked(prefix, message));
      address recover         = ecrecover(hash, _v, _r, _s);

      require(recover == verifier, "MinerGame: Verification failed about tokenBuyPack");
    }

    nonce[msg.sender]++;

    _token.safeTransferFrom(msg.sender, bank, _amount);

    emit TokenBuyPack(msg.sender, _typeId, _amount, _packId, block.timestamp);   
  }

  //gold buy token, It has cooldown time
  function goldChangeToken(uint256 _typeId, uint256 _amount, uint256 _packId, uint8 _v, bytes32 _r, bytes32 _s) external{
    require(_amount > 0, "MinerGame: The token amount must greater than zero");
    require(checkToken(_typeId), "MinerGame: Do not have this token type");
    require(checkCooldown(), "MinerGame: gold-token CD time hasn't come yet");

    uint256 chainId;   
    assembly {
        chainId := chainid()
    } 

    {
      bytes memory prefix     = "\x19Ethereum Signed Message:\n32";
      bytes32 message         = keccak256(abi.encodePacked(_amount, _typeId, msg.sender, nonce[msg.sender], address(this), chainId, _packId));
      bytes32 hash            = keccak256(abi.encodePacked(prefix, message));
      address recover         = ecrecover(hash, _v, _r, _s);

      require(recover == verifier, "MinerGame: Verification failed about goldChangeToken");
    }

    nonce[msg.sender]++;

    PlayerParams storage _player = player[msg.sender];
    _player.tokenBuyingTime = block.timestamp;

    _safeTransfer(token[_typeId], msg.sender, _amount);

    emit GoldChangeToken(msg.sender, _typeId, _amount, _packId, block.timestamp);   
  }

  // we add the user id, but we won't verify it.
  function mintNft(uint256 _generation, uint8 _quality, bytes32, uint8 _v, bytes32 _r, bytes32 _s) external{

    require (_generation >= 0, "MinerGame: generation wrong");
    require (_quality > 0 && _quality < 6, "MinerGame: quality wrong");

    {
      bytes memory prefix     = "\x19Ethereum Signed Message:\n32";
      bytes32 message         = keccak256(abi.encodePacked(msg.sender, address(this), _generation, _quality, nonce[msg.sender]));
      bytes32 hash            = keccak256(abi.encodePacked(prefix, message));
      address recover         = ecrecover(hash, _v, _r, _s);

      require(recover == verifier, "MinerGame: Verification failed about mintNft");
    }

    uint256 nftId = nftFactory.mint(msg.sender, _generation, _quality);
    require(nftId >= 0, "MinerGame: failed to mint a nft!");

    nonce[msg.sender]++;

    emit MintNft(msg.sender, _generation, _quality, block.timestamp);
  }

  //Check whether this token can be exchanged for gold
  function checkToken(uint256 _typeId) public view returns(bool) {
    address _tokenAddress = token[_typeId];

    if(changeAllowed[_tokenAddress]) {
      return true;
    }

    return false;
  }

  //Check the cooldown of gold purchase tokens
  function checkCooldown() public view returns(bool) {
    if(cooldown == 0){
      return true;
    }

    PlayerParams storage _player = player[msg.sender];

    uint256 cooldownTime = _player.tokenBuyingTime;

    if(cooldownTime == 0 || block.timestamp - cooldownTime > cooldown) {
      return true;
    }

    return false;
  }

  //Safe Transfer
  function _safeTransfer(address _token, address _to, uint256 _amount) internal {
    if (_token != address(0)) {
      IERC20 _rewardToken = IERC20(_token);

      uint256 _balance = _rewardToken.balanceOf(vault);
      require(_amount <= _balance, "MinerGame: do not have enough token to reward");

      uint256 _beforBalance = _rewardToken.balanceOf(_to);
      _rewardToken.safeTransferFrom(vault, _to, _amount);

      require(_rewardToken.balanceOf(_to) == _beforBalance + _amount, "MinerGame: Invalid transfer");
    } else {

      uint256 _balance = address(this).balance;
      require(_amount <= _balance, "MinerGame: Do not have enough token to reward");

      payable(_to).transfer(_amount);
    }
  }

  //***owner methods***//
  //Add tokens that can be exchanged for gold
  function addToken(address _token) external onlyOwner {
    require(_token != address(0), "MinerGame: Token can't be zero address");
    require(!changeAllowed[_token], "MinerGame: This token is exist");

    changeAllowed[_token] = true;
    token[++typeId] = _token;

    emit AddToken(_token, typeId, block.timestamp);
  }

  //set CD time 
  function setCooldown(uint256 _newCooldown) external onlyOwner{
    require(_newCooldown > 0, "MinerGame: CD_Cooldown must be greater than 0");
    cooldown = _newCooldown;
  }

  function setVerifier(address _verifier) external onlyOwner {
    verifier = _verifier;
  }

  function setBank(address _bank) external onlyOwner {
    require(_bank != address(0), "MinerGame: Bank can't be zero address");
    bank = _bank;
  }

  function setVault(address _vault) external onlyOwner {
    require(_vault != address(0), "MinerGame: Vault can't be zero address");
    vault = _vault;
  }

  function setRewardToken(address _token) external onlyOwner {
    require(_token != address(0), "MinerGame: rewardToken can't be zero address");
    rewardToken = _token;
  }
  //***owner methods***//



  // Accept native tokens.
  receive() external payable {
    //React to receiving ether
  }

  /// @dev encrypt token data
  /// @return encrypted data
  function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override returns (bytes4) {
    return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
  }

  
}
