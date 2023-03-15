// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Bank {
    mapping(address => uint) public balances; // 银行账本
    uint public totalAmount; // 银行总额

    // 转账记录事件
    event Transfer(address from, address to, uint amount);

    constructor() payable {
        balances[msg.sender] -= msg.value;
        totalAmount += msg.value;

        emit Transfer(msg.sender, address(this), msg.value);
    }

    function balanceOf(address account) external view returns (uint) {
        return balances[account];
    }

    // 提款函数
    function withdraw() external {
        // require(balances[msg.sender] >= 0, "account have no money.");
        if(balances[msg.sender] <= 0){
            revert("account has no money.");
        }
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        totalAmount -= amount;

        emit Transfer(address(this), msg.sender, amount);
    }

    // 转账函数
    function trnasferTo(address to, uint amount) external {
        // require(to != address(0), "to address is invalid.");
        if(to == address(0)){
            revert("to address is invalid.");
        }
        // require(balances[msg.sender] >= amount, "account has no money");
        if(balances[msg.sender] < amount){
            revert("account has no money.");
        }

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }

    receive() external payable {
        balances[msg.sender] = msg.value;
        totalAmount += msg.value;

        emit Transfer(msg.sender, address(this), msg.value);
    }
}
