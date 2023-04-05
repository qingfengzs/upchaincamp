// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
    mapping(address => uint256) public balances;
    uint public totalAmount;
    address public owner;
    IERC20 public token;

    event Deposit(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);
    event TransferToOwner(address owner,uint256 amount);

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
    }

    function deposit(uint256 amount) external {
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        token.transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        totalAmount += amount;
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        token.transfer(msg.sender, amount);
        balances[msg.sender] -= amount;
        totalAmount -= amount;
        emit Withdrawal(msg.sender, amount);
    }

    function totalBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function transferToOwner() external {
        require(totalAmount >= 100,"totalBalance is not enough");
        uint newTotalAmount = totalAmount/2;
        token.transfer(owner,newTotalAmount);
        totalAmount = newTotalAmount;
        emit TransferToOwner(owner,newTotalAmount);
    }
}