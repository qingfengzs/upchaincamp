
const hre = require("hardhat");

async function main() {

  const Bank = await hre.ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();
  
  await bank.deployed();

  console.log(
    `Bank deployed to ${bank.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
