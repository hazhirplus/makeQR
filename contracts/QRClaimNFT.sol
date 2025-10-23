// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QRClaimNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    uint256 public priceWei;
    mapping(address => bool) public claimed;

    event Minted(address indexed user, uint256 indexed tokenId, string tokenURI);

    constructor(uint256 _initialPriceWei) ERC721("Farcaster QR NFT", "FQRC") {
        priceWei = _initialPriceWei;
    }

    function mint(string calldata tokenURI_) external payable {
        require(!claimed[msg.sender], "Already claimed");
        require(msg.value >= priceWei, "Insufficient payment");

        nextTokenId++;
        uint256 tokenId = nextTokenId;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        claimed[msg.sender] = true;

        emit Minted(msg.sender, tokenId, tokenURI_);
    }

    function setPrice(uint256 _priceWei) external onlyOwner {
        priceWei = _priceWei;
    }

    function withdraw(address payable to) external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "No balance");
        to.transfer(bal);
    }
}
