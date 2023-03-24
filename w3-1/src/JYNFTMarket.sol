// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract JYNFTMarket is IERC721Receiver {
    mapping(uint256 => Order) public orders;

    IERC721 private _nftContract;
    IERC20 private _token;
    address payable private _owner;

    // 订单对象
    struct Order {
        address owner;
        uint256 tokenId;
        uint256 price;
    }

    event Listed(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );
    event Unlisted(address indexed seller, uint256 indexed tokenId);
    event Sold(
        address indexed seller,
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 price
    );

    constructor(
        IERC721 nftContract,
        IERC20 tokenContract,
        address payable owner_
    ) {
        _nftContract = nftContract;
        _owner = owner_;
        _token = tokenContract;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    // 上架
    function list(uint256 _tokenId, uint256 _price) public {
        // 检查所属权
        require(
            IERC721(_nftContract).ownerOf(_tokenId) == msg.sender,
            "not nft owner"
        );
        require(orders[_tokenId].owner == address(0), "nft already listing");

        IERC721(_nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId
        );
        orders[_tokenId] = Order(msg.sender, _tokenId, _price*10**18);

        emit Listed(msg.sender, _tokenId, _price);
    }

    // 下架
    function unlist(uint256 _tokenId) public {
        require(orders[_tokenId].owner == msg.sender, "only owner can unlist");

        IERC721(_nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId
        );
        delete orders[_tokenId];

        emit Unlisted(msg.sender, _tokenId);
    }

    // 购买
    function buy(uint256 _tokenId) public payable {
        Order memory order = orders[_tokenId];
        require(order.owner != address(0), "order does not exist");
        // 检查token余额
        require(
            IERC20(_token).balanceOf(msg.sender) >= order.price,
            "balance not enough"
        );
        // 扣款，转账
        IERC20(_token).transferFrom(msg.sender, order.owner, order.price);
        IERC721(_nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        // 删除order
        delete orders[_tokenId];

        emit Sold(order.owner, msg.sender, _tokenId, order.price);
    }
}
