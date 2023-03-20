
const hre = require("hardhat");

async function main() {
  const Score = await ethers.getContractFactory("Score");
  const Teacher = await hre.ethers.getContractFactory("Teacher");
  const teacher = await Teacher.deploy();
  
  await teacher.deployed();

  console.log(
    `Bank deployed to ${teacher.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
