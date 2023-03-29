
const hre = require("hardhat");

async function main() {
  const JYToken = await hre.ethers.getContractFactory("JYToken");
  const jytoken  = await JYToken.deploy();
  await jytoken.deployed();

  console.log(`jytoken deployed at : ${jytoken.address}}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
