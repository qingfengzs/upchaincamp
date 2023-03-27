// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface TokenRecipient {
    function tokensReceived(address _recipient, uint256 _amount) external returns(bool);
}

contract JY2 is ERC20Upgradeable {

    using Address for address;

    function initialize(string memory name, string memory symbol) public initializer {
        __ERC20_init(name, symbol);
        _mint(msg.sender, 10000 * 10**18);
    }
    
    function transferWithCallback(address _recipient,uint256 _amount) public returns(bool){
        _transfer(msg.sender,_recipient,_amount);

        if(_recipient.isContract()){
            bool rv =TokenRecipient(_recipient).tokensReceived(_recipient,_amount);
            require(rv, "No tokensReceived");
        }
        
        return true;
    }
}
