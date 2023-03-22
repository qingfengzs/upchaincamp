
const hre = require("hardhat");

async function main() {

    const JYToken = await hre.ethers.getContractFactory("JY");
    const token = await JYToken.deploy();

    await token.deployed();

    console.log(
        `Bank deployed to ${token.address}`
    );
    
    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await Vault.deploy("0xf37816C765E30a9a0a5F807d3F6F38137CD3aeD4",token.address);

    await vault.deployed();

    console.log(
        `Bank deployed to ${vault.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
