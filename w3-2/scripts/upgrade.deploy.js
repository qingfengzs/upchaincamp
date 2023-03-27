const { ethers, upgrades } = require("hardhat");


const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

async function main() {
    // Deploying
    // const Contract = await ethers.getContractFactory("JY1");
    // const instance = await upgrades.deployProxy(Contract);
    // await instance.deployed();

    // 部署逻辑合约 
    // 部署代理 TransparentUpgradeableProxy
    // 部署代理管理员  ProxyAdmin
    //Upgrading
    const ContractNew = await ethers.getContractFactory("JY2");
    const upgraded = await upgrades.upgradeProxy("0x68CF2ec076EDEE3bADd4635da31481FCE31B8527", ContractNew);

    let currentImplAddress = await getImplementationAddress(ethers.provider, upgraded.address);
    console.log(`upgraded address: ${upgraded.address} `);
    console.log(`currentImplAddress address : ${currentImplAddress} `);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });