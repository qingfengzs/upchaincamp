// 引入hardhat和chai库
const { expect } = require("chai");
const { ethers } = require("hardhat");

// 定义一个测试套件
describe("Bank", function () {
  // 定义一些变量和常量
  let Bank;
  let bank;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // 在每个测试之前部署智能合约
  beforeEach(async function () {
    Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy();
    await bank.deployed();
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  // 编写具体的测试用例
  it("测试部署", async function () {
    expect(await bank.totalAmount()).to.equal(0);
    expect(await bank.balanceOf(owner.address)).to.equal(0);
  });

  it("测试接受转账", async function () {
    await owner.sendTransaction({
      to: bank.address,
      value: ethers.utils.parseEther("1.0"),
    });
    expect(await bank.totalAmount()).to.equal(ethers.utils.parseEther("1.0"));
    expect(await bank.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("1.0")
    );

    await addr1.sendTransaction({
      to: bank.address,
      value: ethers.utils.parseEther("2.0"),
    });
    expect(await bank.totalAmount()).to.equal(ethers.utils.parseEther("3.0"));
    expect(await bank.balanceOf(addr1.address)).to.equal(
      ethers.utils.parseEther("2.0")
    );

    await addr2.sendTransaction({
      to: bank.address,
      value: ethers.utils.parseEther("3.0"),
    });
    expect(await bank.totalAmount()).to.equal(ethers.utils.parseEther("6.0"));
    expect(await bank.balanceOf(addr2.address)).to.equal(
      ethers.utils.parseEther("3.0")
    );
  });

  it("测试提款", async function () {
    await owner.sendTransaction({
      to: bank.address,
      value: ethers.utils.parseEther("1.0"),
    });

    await expect(bank.connect(addr1).withdraw()).to.be.revertedWith(
      "account has no money."
    );

    await expect(bank.connect(owner).withdraw())
      .to.emit(bank, "Transfer")
      .withArgs(bank.address, owner.address, ethers.utils.parseEther("1.0"));

    expect(await bank.totalAmount()).to.equal(0);
    expect(await bank.balanceOf(owner.address)).to.equal(0);

    const balanceBefore = await owner.getBalance();
    const tx = await owner.sendTransaction({
      to: bank.address,
      value: ethers.utils.parseEther("5.5"),
    });
    const gasUsed = tx.gasPrice.mul((await tx.wait()).gasUsed);
    const balanceAfterDeposit = balanceBefore
      .sub(gasUsed)
      .sub(ethers.utils.parseEther("5.5"));

    const tx2 = await bank.connect(owner).withdraw();
    const gasUsed2 = tx2.gasPrice.mul((await tx2.wait()).gasUsed);
    const balanceAfterWithdrawal = balanceAfterDeposit
      .sub(gasUsed2)
      .add(ethers.utils.parseEther("5.5"));

    expect(balanceAfterWithdrawal).equal(
      balanceBefore.sub(gasUsed).sub(gasUsed2)
    );
  });

  it("测试转账", async function () {
    await owner.sendTransaction({
      to: bank.address,
      value: ethers.utils.parseEther("1.0"),
    });

    await bank
      .connect(owner)
      .trnasferTo(addr1.address, ethers.utils.parseEther("0.5"));

    expect(await bank.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("0.5")
    );
    expect(await bank.balanceOf(addr1.address)).to.equal(
      ethers.utils.parseEther("0.5")
    );

    await expect(
      bank
        .connect(addr1)
        .trnasferTo(owner.address, ethers.utils.parseEther("2"))
    ).to.be.revertedWith("account has no money.");
    
    await expect(
      bank
        .connect(owner)
        .trnasferTo('0x0000000000000000000000000000000000000000', ethers.utils.parseEther("0.1"))
    ).to.be.revertedWith("to address is invalid.");

  });
});
