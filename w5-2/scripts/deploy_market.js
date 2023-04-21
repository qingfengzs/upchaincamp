let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');

let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    // await run('compile');
    let [owner] = await ethers.getSigners();

    let TokenA = await ethers.getContractFactory("Token");
    let tokena = await TokenA.deploy(
        "AToken",
        "AToken",
        ethers.utils.parseUnits("100000", 18));

    await tokena.deployed();
    console.log("AToken:" + tokena.address);

    let TokenB = await ethers.getContractFactory("Token");
    let tokenb = await TokenB.deploy(
        "BToken",
        "BToken",
        ethers.utils.parseUnits("200000", 18));

    await tokenb.deployed();
    console.log("BToken:" + tokenb.address);

    let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

    // sepolia
    let routerAddr = "0xeFb379FdCb30aeaACB64712e2ba212859Ed23B78";
    let wethAddr = "0xfE577425a7614a694911821e3FA505a0b223ba65";
    // 本地
    // let routerAddr = "0xaaac9012592c0c4fdebf853bDF1a34232385D581";
    // let wethAddr = "0xC51c0619d25804d637Bb294b3bfaA0D0De6a8222";

    let market = await MyTokenMarket.deploy(
        routerAddr,
        wethAddr,
    );

    await market.deployed();
    console.log("market: " + market.address);

    await tokena.approve(market.address, ethers.utils.parseUnits("10000",18));
    await tokenb.approve(market.address, ethers.utils.parseUnits("20000",18));

    // 延时15s
    await wait(15000);

    let amountA = ethers.utils.parseUnits("100",18);
    let amountB = ethers.utils.parseUnits("200",18);
    console.log(`添加流动性:[ tokenA: ${amountA} <=> tokenB: ${amountB} ]`);
    await market.AddLiquidity(tokena.address,amountA,tokenb.address,amountB);
    
    // 延时15s
    await wait(15000);

    let inAmount = ethers.utils.parseUnits("50",18);
    let buyNumB = ethers.utils.parseUnits("10",18);

    let aAmount = await tokena.balanceOf(owner.address);
    let bAmount = await tokenb.balanceOf(owner.address);
    console.log("owner 持有tokenA: " + ethers.utils.formatUnits(aAmount, 18));
    console.log("owner 持有tokenB: " + ethers.utils.formatUnits(bAmount, 18));

    await market.buyTokenWithToken(tokena.address,tokenb.address,inAmount,buyNumB);

    // 延时15s
    await wait(15000);

    let buyAmount = await tokenb.balanceOf(owner.address);

    console.log("owner购买到: " + (ethers.utils.formatUnits(buyAmount, 18)-ethers.utils.formatUnits(bAmount, 18)));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });