let { ethers } = require("hardhat");
let { writeAddr } = require("./artifact_log.js");
const delay = require("./delay.js");

let susui;
let masterChef;

async function deploySusui() {
  let SushiToken = await ethers.getContractFactory("SushiToken");
  susui = await SushiToken.deploy();
  await susui.deployed();

  console.log("susui:" + susui.address);
}

async function deployMasterChef() {
  let MasterChef = await ethers.getContractFactory("MasterChef");
  let award = ethers.utils.parseUnits("40", 18);

  masterChef = await MasterChef.deploy(susui.address, award, 10);
  await masterChef.deployed();

  console.log("masterChef:" + masterChef.address);
}

async function main() {
  // await run('compile');
  let [owner, second] = await ethers.getSigners();

  await deploySusui();
  await deployMasterChef();

  let tx = await susui.transferOwnership(masterChef.address);
  await tx.wait();

  let Token = await ethers.getContractFactory("Token");
  let aAmount = ethers.utils.parseUnits("100000", 18);
  let atoken = await Token.deploy("AToken", "AToken", aAmount);

  await atoken.deployed();
  console.log("AToken:" + atoken.address);

  tx = await masterChef.add(100, atoken.address, true);
  await tx.wait();

  let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

  // sepolia
  // let routerAddr = "0xeFb379FdCb30aeaACB64712e2ba212859Ed23B78";
  // let wethAddr = "0xfE577425a7614a694911821e3FA505a0b223ba65";
  // local
  let routerAddr = "0xaaac9012592c0c4fdebf853bDF1a34232385D581";
  let wethAddr = "0xC51c0619d25804d637Bb294b3bfaA0D0De6a8222";

  let market = await MyTokenMarket.deploy(
    atoken.address,
    routerAddr,
    wethAddr,
    susui.address,
    masterChef.address
  );

  await market.deployed();
  console.log("market:" + market.address);

  await atoken.approve(market.address, ethers.constants.MaxUint256);

  let ethAmount = ethers.utils.parseUnits("5", 18);
  await market.AddLiquidity(aAmount, { value: ethAmount });
  console.log("添加流动性");

  let buyEthAmount = ethers.utils.parseUnits("10", 18);
  out = await market.buyToken("0", { value: buyEthAmount });

  b = await atoken.balanceOf(masterChef.address);
  console.log("存入:" + ethers.utils.formatUnits(b, 18));

  await delay.advanceBlock(ethers.provider);
  await delay.advanceBlock(ethers.provider);

  let pending = await masterChef.pendingSushi(0, market.address);
  console.log("收益:" + ethers.utils.formatUnits(pending, 18));

  tx = await market.withdraw();
  await tx.wait();

  b = await susui.balanceOf(owner.address);
  console.log("获取 sushi:" + ethers.utils.formatUnits(b, 18));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
