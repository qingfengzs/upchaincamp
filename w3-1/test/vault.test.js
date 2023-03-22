const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault", function () {
    let Vault;
    let vault;
    let Token;
    let token;
    let owner;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        Token = await ethers.getContractFactory("JY");
        token = await Token.connect(owner).deploy();
        await token.deployed();

        Vault = await ethers.getContractFactory("Vault");
        vault = await Vault.connect(owner).deploy(owner.address,token.address);
        await vault.deployed();
    });

    it("测试存款", async function () {
        const depositAmount = ethers.utils.parseUnits("1000",18);


        await token.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);

        expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("9000",18));
        expect(await token.balanceOf(vault.address)).to.equal(depositAmount);
        expect(await vault.balances(owner.address)).to.equal(depositAmount);

        const depositEvent = (await vault.queryFilter("Deposit"))[0];
        expect(depositEvent.args.sender).to.equal(owner.address);
        expect(depositEvent.args.amount).to.equal(depositAmount);
    });

    it("测试提款", async function () {
        const depositAmount = ethers.utils.parseUnits("1000",18);
        await token.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);

        const withdrawalAmount = ethers.utils.parseUnits("500",18);
        await vault.withdraw(withdrawalAmount);

        expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("9500",18));
        expect(await token.balanceOf(vault.address)).to.equal(ethers.utils.parseUnits("500",18));
        expect(await vault.balances(owner.address)).to.equal(ethers.utils.parseUnits("500",18));

        const withdrawalEvent = (await vault.queryFilter("Withdrawal"))[0];
        expect(withdrawalEvent.args.recipient).to.equal(owner.address);
        expect(withdrawalEvent.args.amount).to.equal(withdrawalAmount);
    });

    it("测试超额取款", async function () {
        const depositAmount = ethers.utils.parseUnits("1000",18);
        const withdrawalAmount = ethers.utils.parseUnits("10000",18);


        await token.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);

        await expect(vault.connect(owner).withdraw(withdrawalAmount)).to.be.revertedWith(
            "Insufficient balance"
        );
    });

    it("测试超额存款", async function () {
        const depositAmount = ethers.utils.parseUnits("100000",18);
        await token.approve(vault.address, ethers.utils.parseUnits("10000",18));

        await expect(vault.connect(owner).deposit(depositAmount)).to.be.revertedWith(
            "Insufficient balance"
        );
    });

    it("测试金库总额", async function () {
        const depositAmount = ethers.utils.parseUnits("1000",18);
        await token.approve(vault.address, ethers.utils.parseUnits("10000",18));

        await vault.connect(owner).deposit(depositAmount);
        await vault.connect(owner).deposit(depositAmount);

        expect(await vault.totalBalance()).to.equal(ethers.utils.parseUnits("2000",18));
    });
});
