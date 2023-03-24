// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable, IERC721Receiver {
    // using SafeMath for uint256;

    // IERC20 public token;
    // IERC721 public nft;

    // struct Order {
    //     address owner;
    //     uint256 tokenId;
    //     uint256 price;
    // }

    // mapping(uint256 => Order) public orders;

    // event NFTListed(uint256 indexed tokenId, uint256 price);
    // event NFTSold(uint256 indexed tokenId, uint256 price, address buyer);

    // constructor(
    //     IERC20 _token,
    //     IERC721 _nft
    // ) {
    //     token = _token;
    //     nft = _nft;
    // }

    // function listNFT(uint256 _tokenId, uint256 _price) external {
    //     require(nft.ownerOf(_tokenId) == msg.sender, "Not the owner of the NFT");
    //     require(orders[_tokenId].owner == address(0), "NFT is already on sale");

    //     orders[_tokenId] = Order({
    //         owner: msg.sender,
    //         tokenId: _tokenId,
    //         price: _price
    //     });

    //     nft.safeTransferFrom(msg.sender, address(this), _tokenId);

    //     emit NFTListed(_tokenId, _price);
    // }

    // function buyNFT(uint256 _tokenId) external {
    //     Order storage order = orders[_tokenId];
    //     require(order.owner != address(0), "NFT is not on sale");

    //     uint256 price = order.price;
    //     address owner = order.owner;

    //     token.transferFrom(msg.sender, owner, price);
    //     token.approve(address(nft), price);
    //     nft.safeTransferFrom(address(this), msg.sender, _tokenId);

    //     delete orders[_tokenId];

    //     emit NFTSold(_tokenId, price, msg.sender);
    // }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}