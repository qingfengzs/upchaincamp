let { ethers } = require("hardhat");
let { writeAddr } = require("./artifact_log.js");
const delay = require("./delay.js");

let susui;
let masterChef;

let wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  // 延时15s
  await wait(15000);

  await deployMasterChef();

  // 延时15s
  await wait(15000);

  let tx = await susui.transferOwnership(masterChef.address);
  await tx.wait();

  let Token = await ethers.getContractFactory("Token");
  let aAmount = ethers.utils.parseUnits("1000", 18);
  let atoken = await Token.attach("0x207FD31eb4fCd98A8c0FF743B6C26FD170b0De39");
  // let atoken = await Token.deploy("AToken", "AT", aAmount);
  // await atoken.deployed();
  console.log("AToken:" + atoken.address);

  tx = await masterChef.add(100, atoken.address, true);
  await tx.wait();

  // 延时15s
  await wait(15000);

  let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

  // sepolia
  let routerAddr = "0xeFb379FdCb30aeaACB64712e2ba212859Ed23B78";
  let wethAddr = "0xfE577425a7614a694911821e3FA505a0b223ba65";
  // local
  // let routerAddr = "0x02A0a58bA8eA279E02C53aEFe5051c7FD9ecB218";
  // let wethAddr = "0xb0Ee103c491521462C6b50C193738e86475d56C9";

  let market = await MyTokenMarket.deploy(
    atoken.address,
    routerAddr,
    wethAddr,
    susui.address,
    masterChef.address
  );

  await market.deployed();
  console.log("market:" + market.address);

  // 延时15s
  await wait(15000);

  await atoken.approve(market.address, ethers.constants.MaxUint256);

  let ethAmount = ethers.utils.parseUnits("0.2", 18);
  await market.AddLiquidity(aAmount, { value: ethAmount });
  console.log("添加流动性");

  // 延时15s
  await wait(15000);

  let buyEthAmount = ethers.utils.parseUnits("0.1", 18);
  out = await market.buyToken("0", { value: buyEthAmount });

  // 延时15s
  await wait(15000);

  b = await atoken.balanceOf(masterChef.address);
  console.log("存入:" + ethers.utils.formatUnits(b, 18));

  // await delay.advanceBlock(ethers.provider);
  // await delay.advanceBlock(ethers.provider);

  // 延时15s
  await wait(15000);
  let pending = await masterChef.pendingSushi(0, market.address);
  console.log("收益:" + ethers.utils.formatUnits(pending, 18));

  // 延时15s
  await wait(15000);
  tx = await market.withdraw();
  await tx.wait();

  // 延时15s
  await wait(15000);

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
