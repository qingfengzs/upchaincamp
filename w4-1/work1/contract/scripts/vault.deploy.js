
const hre = require("hardhat");

async function main() {
  const Vault = await hre.ethers.getContractFactory("Vault");
  const vault  = await Vault.deploy("0xdC681661337Dc7A1dF6405747Eb6879e35295Dec");
  await vault.deployed();

  console.log(`vault deployed at : ${vault.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
