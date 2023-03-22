// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JY is ERC20 {

    constructor() ERC20("JinYu", "JY") {
        // 设置总的代币数量
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }
    
}
