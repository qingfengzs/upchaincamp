
const hre = require("hardhat");

async function main() {

    const JYNFTMarket = await hre.ethers.getContractFactory("JYNFTMarket");
    const nftMarket = await JYNFTMarket.deploy(
        "0xb72056E262DD0E155aB76714d5165f63bF09bA68",
        "0xE13b88DFadB8ce969CBB088583A41a88d1F3c335",
        "0xf37816C765E30a9a0a5F807d3F6F38137CD3aeD4");

    await nftMarket.deployed();

    console.log(
        `JYNFTMarket deployed to ${nftMarket.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
