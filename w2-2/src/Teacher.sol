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

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner != msg.sender, "only owner can be used");
        _;
    }

    function addScore(
        string memory _name,
        address _student,
        uint8 _score
    ) external onlyOwner {
        require(students[_name] == address(0), "student already exists");
        score.addScore(_student, _score);
        students[_name] = _student;
    }

    function updateScore(address _student, uint8 _score) external onlyOwner {
        score.updateScore(_student, _score);
    }

    function getScore(address _student) external view returns (uint8) {
        return score.getScore(_student);
    }

    function getScore(string memory _student) external view returns (uint8) {
        return score.getScore(students[_student]);
    }

    function createScore(address _teacher) external onlyOwner {
        require(address(score) == address(0), "score already exists");
        score = new Score(_teacher);
    }
}
