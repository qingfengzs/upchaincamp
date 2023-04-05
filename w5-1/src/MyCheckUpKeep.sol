// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./AutomationCompatible.sol";
import "./Vault.sol";

contract MyCheckUpKeep is AutomationCompatibleInterface {
    Vault public vault;

    constructor(address _vault) {
        vault = Vault(_vault);
    }

    function checkUpkeep(
        bytes calldata 
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory)
    {
        if(vault.totalAmount() >= 100 * 10 ** 18){
            upkeepNeeded = true;
        }
    }

    function performUpkeep(bytes calldata) external override {
        vault.transferToOwner();
    }
}
