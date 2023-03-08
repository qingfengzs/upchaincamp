// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Counter{

    uint public count;

    function addCount(uint x) public {
        count += x;
    }

}