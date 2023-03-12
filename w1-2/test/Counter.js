const { expect } = require("chai");

describe("Counter", function () {
  describe("Deployment", () => {
    it("部署人地址正确", async () => {
      const Counter = await ethers.getContractFactory("Counter");
      const counter = await Counter.deploy("100");
      [owner] = await ethers.getSigners();
      expect(await counter.owner()).to.be.equal(owner.address);
      
    });

  });

  describe("Count", () => {
    it("其他人调用失败", async () => {
      const Counter = await ethers.getContractFactory("Counter");
      const counter = await Counter.deploy(10);
      await counter.deployed();

      const accounts = await ethers.getSigners();
      const attacker = accounts[1];

      await expect(counter.connect(attacker).count()).to.be.revertedWith(
        "only owner is allowed!"
      );

    });

    it("部署者调用成功",async () =>{
      const Counter = await ethers.getContractFactory("Counter");
      const counter = await Counter.deploy(0);
      await counter.deployed();

      [owner] = await ethers.getSigners();
      await counter.connect(owner).count();
      const count = await counter.counter();
      console.log(count);
      expect(count).to.be.equal(1);

      });

  });
});
