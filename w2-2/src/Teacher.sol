// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Score.sol";

/**
 * @title Teacher contract
 * @author
 * @notice Teacher contract can set score by Score interface.
 */
contract Teacher {
    IScore public score;
    address public owner;
    mapping(string => address) public students; // name => student
    mapping(address => bool) public studentRecords; // address => '' ,防重&检测更新

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {

        require(owner == msg.sender, "only owner can be used");
        _;

    }

    // 检测Score合约是否创建
    modifier checkScoreExist() {

        require(address(score) != address(0), "Score contract is invalid");
        _;
        
    }

    function addScore(
        string memory _name,
        address _student,
        uint8 _score
    ) external onlyOwner checkScoreExist{

        require(studentRecords[_student] == false, "student already exists");
        score.addScore(_student, _score);
        students[_name] = _student;
        studentRecords[_student] = true;
        
    }

    function updateScore(address _student, uint8 _score) external onlyOwner checkScoreExist{

        require(studentRecords[_student] == true, "student not found");
        score.updateScore(_student, _score);

    }

    function getScoreByAddress(address _student) external view checkScoreExist returns (uint8) {

        return score.getScore(_student);

    }

    function getScoreByName(string memory _student) external view checkScoreExist returns (uint8) {

        return score.getScore(students[_student]);

    }

    function createScore() external onlyOwner {

        require(address(score) == address(0), "score already exists");
        score = new Score(address(this));

    }
}
