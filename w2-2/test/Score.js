const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Score contract", function () {
  let score;
  let teacher;
  let student1;

  beforeEach(async function () {
    // 部署Score合约
    [teacher, student1] = await ethers.getSigners();
    const Score = await ethers.getContractFactory("Score");
    score = await Score.deploy(teacher.address);
    await score.deployed();
  });

  it("测试正常添加和修改", async function () {
    // 添加学生分数
    await score.addScore(student1.address, 80);
    expect(await score.getScore(student1.address)).to.equal(80);

    // 更新学生分数
    await score.updateScore(student1.address, 90);
    expect(await score.getScore(student1.address)).to.equal(90);
  });

  it("测试分数小于100", async function() {
    try {
      await score.addScore(student.address, 101);
    } catch (error) {
      expect(error.message).to.contain("score must be less than 100");
      return;
    }
    expect.fail("测试不通过");
  });

  it("测试非教师修改", async function () {
    try{
      const nonTeacher = await ethers.getSigner(2);
      await nonTeacher.addScore(student1.address, 90);
    }catch(error){
      expect(error.message).to.contain("only teacher can modify");
    }
    expect.fail("测试不通过");
  });

  it("should revert if student is not found", async function () {
    await expect(score.updateScore(student1.address, 90)).to.be.revertedWith("student not found");
  });
});
