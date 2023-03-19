const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Teacher", function () {
  let Teacher, Score, teacher, score, owner, student1, student2;

  before(async function () {
    [owner, student1, student2] = await ethers.getSigners();
    Score = await ethers.getContractFactory("Score");
    Teacher = await ethers.getContractFactory("Teacher");
    score = await Score.deploy(owner.address);
    teacher = await Teacher.deploy();
    await teacher.createScore(score.address);
    await score.addScore(student1.address, 80);
  });

  describe("addScore", function () {
    it("should add a student's score", async function () {
      await teacher.addScore("Alice", student1.address, 90);
      expect(await score.getScore(student1.address)).to.equal(90);
      expect(await teacher.getScore(student1.address)).to.equal(90);
      expect(await teacher.getScore("Alice")).to.equal(90);
    });
  });

  describe("updateScore", function () {
    it("should update a student's score", async function () {
      await teacher.updateScore(student1.address, 85);
      expect(await score.getScore(student1.address)).to.equal(85);
      expect(await teacher.getScore(student1.address)).to.equal(85);
      expect(await teacher.getScore("Alice")).to.equal(90);
    });
  });

  describe("getScore", function () {
    it("should return a student's score", async function () {
      expect(await teacher.getScore(student1.address)).to.equal(85);
      expect(await teacher.getScore(student2.address)).to.equal(0);
    });
  });

  describe("createScore", function () {
    it("should create a new Score contract", async function () {
      const newScore = await Score.deploy(owner.address);
      await teacher.createScore(newScore.address);
      expect(await teacher.score()).to.equal(newScore.address);
    });

    it("should not create a new Score contract if one already exists", async function () {
      const newScore = await Score.deploy(owner.address);
      await expect(teacher.createScore(newScore.address)).to.be.revertedWith(
        "score already exists"
      );
    });
  });
});
