const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Teacher", function () {

  let Teacher;
  let Score;
  let student1;
  let teacherContract
  let score;

  beforeEach(async function () {

    Score = await ethers.getContractFactory("Score");
    Teacher = await ethers.getContractFactory("Teacher");
    teacherContract = await Teacher.deploy();
    await teacherContract.deployed();

    await teacherContract.createScore();
    const scoreAddress = await teacherContract.score();
    score = await Score.attach(scoreAddress);

    [owner, teacher, student1, student2] = await ethers.getSigners();

  });

  it("测试Score未创建", async () => {
    let newTeacher = await ethers.getContractFactory("Teacher");
    let newTeacherContract = await newTeacher.connect(owner).deploy();
    await newTeacherContract.connect(owner).deployed();

    await expect(newTeacherContract.connect(owner).addScore("Alice", student1.address, 10))
      .to.be.revertedWith("Score contract is invalid");
  });

  it("测试添加分数", async function () {

    const name = "Alice";
    const scoreValue = 80;

    await expect(
      teacherContract.addScore(name, student1.address, scoreValue)
    )
      .to.emit(score, "ScoreAddLog")
      .withArgs(student1.address, scoreValue);

    expect(await teacherContract.getScoreByAddress(student1.address)).to.equal(
      scoreValue
    );
    expect(await teacherContract.getScoreByName(name)).to.equal(scoreValue);

  });

  it("测试添加分数-学生已存在", async function () {

    const name = "Alice";
    const scoreValue = 80;
    await teacherContract.addScore(name, student1.address, scoreValue);
    await expect(
      teacherContract.addScore(name, student1.address, scoreValue)
    ).to.be.revertedWith("student already exists");

  });

  it("测试更新分数", async function () {

    const name = "Alice";
    const scoreValue1 = 80;
    const scoreValue2 = 90;
    await teacherContract.addScore(name, student1.address, scoreValue1);
    await expect(
      teacherContract.updateScore(student1.address, scoreValue2)
    )
      .to.emit(score, "ScoreUpdateLog")
      .withArgs(student1.address, scoreValue1, scoreValue2);
    expect(await teacherContract.getScoreByAddress(student1.address)).to.equal(
      scoreValue2
    );
    expect(await teacherContract.getScoreByName(name)).to.equal(scoreValue2);

  });

  it("测试更新分数-学生不存在", async function () {

    const scoreValue = 80;
    await expect(
      teacherContract.updateScore(student1.address, scoreValue)
    ).to.be.revertedWith("student not found");

  });

  it("测试获取分数", async function () {

    const scoreValue = 80;
    await teacherContract.addScore("Alice", student1.address, scoreValue);
    expect(await teacherContract.getScoreByAddress(student1.address)).to.equal(
      scoreValue
    );

  });

  it("测试创建Score合约", async function () {

    expect(await teacherContract.score()).to.equal(score.address);

  });

  it("测试创建Score合约-合约已创建", async function () {

    await expect(teacherContract.createScore()).to.be.revertedWith("score already exists");

    expect(await teacherContract.score()).to.equal(score.address);

  });

});