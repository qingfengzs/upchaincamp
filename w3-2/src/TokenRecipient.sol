// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface TokenRecipient {
    function tokensReceived(
        address _recipient,
        uint256 _amount
    ) external returns (bool);
}

contract TokenRecipientMock is TokenRecipient {
    bool public transactionStatus = true;

    function setTransactionStatus(bool status) external {
        transactionStatus = status;
    }


    function tokensReceived(
        address _recipient,
        uint256 _amount
    ) external override returns (bool) {
        return transactionStatus;
    }
}
