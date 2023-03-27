const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('JY2', function () {
    let JY2;
    let jy2;
    let owner;
    let recipient;

    beforeEach(async function () {
        [owner, recipient] = await ethers.getSigners();
        JY2 = await ethers.getContractFactory('JY2');
        jy2 = await JY2.connect(owner).deploy();
        await jy2.deployed();

    });

    describe('transferWithCallback', function () {
        it('测试合约地址接受', async function () {
            const recipientContract = await ethers.getContractFactory('TokenRecipientMock');
            const mockContract = await recipientContract.deploy();
            await mockContract.deployed();
            const amount = ethers.utils.parseUnits("1000", 18);

            // 将Mock合约地址作为接收地址，调用transferWithCallback函数
            await expect(jy2.connect(owner).transferWithCallback(mockContract.address, amount)).to.emit(jy2, 'Transfer');

            expect(await jy2.balanceOf(mockContract.address)).to.equal(amount);
        });

        it('测试EOA账户接受', async function () {

            const amount = ethers.utils.parseUnits("1000", 18);

            // 将EOA地址作为接收地址，调用transferWithCallback函数
            await expect(jy2.connect(owner).transferWithCallback(recipient.address, amount)).to.emit(jy2, 'Transfer');

            expect(await jy2.balanceOf(recipient.address)).to.equal(amount);
        });

        it('测试合约失败情况', async function () {
            const recipientContract = await ethers.getContractFactory('TokenRecipientMock');
            const mockContract = await recipientContract.deploy();
            await mockContract.deployed();

            // tokensReceived函数返回false，交易应该会失败
            await mockContract.setTransactionStatus(false);

            await expect(jy2.connect(owner).transferWithCallback(mockContract.address, 1000)).to.be.revertedWith('No tokensReceived');
        });
    });
});