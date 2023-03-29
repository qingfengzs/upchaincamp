// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract JYToken is ERC20Permit {

    constructor() ERC20("JYToken", "JY") ERC20Permit("JYToken") {
        _mint(msg.sender, 10000 * 10 ** 18);
    }
    
}