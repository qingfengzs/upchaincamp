
const hre = require("hardhat");

async function main() {

    const JYNFT = await hre.ethers.getContractFactory("JYNFT");
    const nft = await JYNFT.deploy();

    await nft.deployed();

    console.log(
        `NFT deployed to ${nft.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
