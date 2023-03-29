// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface TokenRecipient {
    function tokensReceived(
        address sender,
        uint amount
    ) external returns (bool);
}

contract Vault {
    mapping(address => uint) public deposited;
    address public immutable token;

    event Deposit(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);

    constructor(address _token) {
        token = _token;
    }

    function deposit(address user, uint amount) public {
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer from error"
        );
    
        deposited[user] += amount;

        emit Deposit(user, amount);
    }

    function permitDeposit(
        address user,
        uint amount,
        uint deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        IERC20Permit(token).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        deposit(user, amount);
    }

    function withdraw(uint256 amount) external {
        require(deposited[msg.sender] >= amount, "Insufficient balance");
        
        IERC20(token).transfer(msg.sender, amount);
        deposited[msg.sender] -= amount;

        emit Withdrawal(msg.sender, amount);
    }

    // 收款时被回调
    function tokensReceived(
        address sender,
        uint amount
    ) external returns (bool) {
        require(msg.sender == token, "invalid");
        deposited[sender] += amount;
        return true;
    }

}
