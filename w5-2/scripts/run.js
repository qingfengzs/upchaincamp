const { time } = require("@nomicfoundation/hardhat-network-helpers");
let { ethers } = require("hardhat");

let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  // await run('compile');
  let [owner] = await ethers.getSigners();
  let Token = await ethers.getContractFactory("Token");

  // let tokena = await Token.attach("0x160EC702E8025344e75b089A123d87140326c239");
  // let tokenb = await Token.attach("0x0d41B4695C8bd11fe5719F67c04beF02b89adcAa");

  let tokena = await Token.attach("0x2caAaBC41F1b3233B4e1B8c2670822afe6492d59");
  let tokenb = await Token.attach("0x5505eb2064a6C6096f7E7C00aEEfF5c726c04d88");

  let amountA = await tokena.balanceOf(owner.address);
  let amountB = await tokenb.balanceOf(owner.address);
  console.log("owner 持有tokenA: " + ethers.utils.formatUnits(amountA, 18));
  console.log("owner 持有tokenB: " + ethers.utils.formatUnits(amountB, 18));

  let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
  // let market = await MyTokenMarket.attach("0xf8a3c4FcB6d167C4784AB22b7b5Aa3605c35d40C");
  let market = await MyTokenMarket.attach("0x9a0243C841B24a35B6cb9C1c1a5da1fFA8af9C1a");

  let inAmount = ethers.utils.parseUnits("5",18);
  let buyNumB = ethers.utils.parseUnits("1",18);
  await market.buyTokenWithToken(tokenb.address,tokena.address,inAmount,buyNumB);
  
  // 延时15s
  await wait(15000);

  amountA = await tokena.balanceOf(owner.address);
  amountB = await tokenb.balanceOf(owner.address);

  console.log("owner 购买后持有tokenA: " + ethers.utils.formatUnits(amountA, 18));
  console.log("owner 购买后持有tokenB: " + ethers.utils.formatUnits(amountB, 18));

  // let allowanceAmount = await tokena.allowance(owner.address,market.address);
  // console.log("allowanceAmount: " + ethers.utils.formatUnits(allowanceAmount));

  // let inAmount = ethers.utils.parseUnits("50",18);
  // let buyNumB = ethers.utils.parseUnits("10",18);
  // await market.buyTokenWithToken(tokenb.address,tokena.address,inAmount,buyNumB);

  // let afterAmount = await tokena.balanceOf(owner.address);
  // console.log("owner 购买后持有tokenA: " + ethers.utils.formatUnits(afterAmount, 18));
  
  // console.log("owner 购买到token："+ (ethers.utils.formatUnits(afterAmount, 18) - ethers.utils.formatUnits(amountA, 18)));

}

main();