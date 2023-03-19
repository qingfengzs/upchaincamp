
const hre = require("hardhat");

async function main() {

  const Score = await hre.ethers.getContractFactory("Score");
  const score = await Score.deploy();
  
  await score.deployed();

  console.log(
    `Bank deployed to ${score.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
