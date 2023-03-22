const { expect } = require("chai");

describe("JY", function () {
    let erc20;
    let owner;
    let addr1;
    let addr2;
    let decimals = 18;

    beforeEach(async function () {
        [owner, addr1,addr2] = await ethers.getSigners();

        const JY = await ethers.getContractFactory("JY");
        erc20 = await JY.deploy();
        await erc20.deployed();
    });

    it("测试Token名称'JinYu'", async function () {
        expect(await erc20.name()).to.equal("JinYu");
    });

    it("测试Token符号'JY'", async function () {
        expect(await erc20.symbol()).to.equal("JY");
    });

    it("测试创建者余额为10000个token", async function () {
        const balance = await erc20.balanceOf(owner.address);
        expect(balance).to.equal(ethers.BigNumber.from((10**22).toLocaleString('fullwide', {useGrouping:false})));
    });

    it("测试转账", async function () {
        // 设置转账金额
        const amount = ethers.utils.parseUnits("1000", 18);
        await erc20.transfer(addr1.address, amount);
        const balanceOwner = await erc20.balanceOf(owner.address);
        const balanceAddr1 = await erc20.balanceOf(addr1.address);

        expect(balanceOwner).to.equal(ethers.utils.parseUnits("9000", 18));
        expect(balanceAddr1).to.equal(ethers.utils.parseUnits("1000", 18));
    });

    it("测试授权",async ()=>{
        const amount = ethers.utils.parseUnits("1000",18);

        await erc20.approve(addr1.address, amount);

        const allowanceBalance = await erc20.allowance(owner.address,addr1.address);
        
        expect(allowanceBalance).to.equal(ethers.utils.parseUnits("1000",18));
    });

    it("测试transferFrom",async ()=>{
        const amount = ethers.utils.parseUnits("1000",18);

        await erc20.approve(addr1.address, amount);
        const allowanceBalance = await erc20.allowance(owner.address,addr1.address);
        expect(allowanceBalance).to.equal(ethers.utils.parseUnits("1000",18));

        await erc20.connect(addr1).transferFrom(owner.address,addr2.address,amount);

        const balanceOwner = await erc20.balanceOf(owner.address);
        const balanceAddr2 = await erc20.balanceOf(addr2.address);

        const allowanceBalance2 = await erc20.allowance(owner.address,addr1.address);
        expect(allowanceBalance2).to.equal(ethers.utils.parseUnits("0",18));

        expect(balanceOwner).to.equal(ethers.utils.parseUnits("9000", 18));
        expect(balanceAddr2).to.equal(ethers.utils.parseUnits("1000", 18));
    });

});
