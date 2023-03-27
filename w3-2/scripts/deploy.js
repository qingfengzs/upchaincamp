const { ethers, upgrades } = require("hardhat");

const { getImplementationAddress } = require('@openzeppelin/upgrades-core');


async function main() {
  // 部署逻辑合约 
  // 部署代理 TransparentUpgradeableProxy
  // 部署代理管理员  ProxyAdmin

  const Contract = await ethers.getContractFactory("JY1");
  const instance = await upgrades.deployProxy(Contract,["JinYu", "JY"]);
  await instance.deployed();

  let currentImplAddress = await getImplementationAddress(ethers.provider, instance.address);

  console.log("instance.address:", instance.address);
  console.log("currentImplAddress.address:", currentImplAddress);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });