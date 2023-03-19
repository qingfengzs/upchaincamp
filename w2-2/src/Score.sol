// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IScore {

    function addScore(address _student, uint8 _score) external;

    function updateScore(address _student, uint8 _score)external;

    function getScore(address _student)external view returns(uint8);
}

/**
 * @title Score contract
 * @author
 * @notice Score contract offer interface for update scores,and it only update by teacher.
 */
contract Score is IScore {
    mapping(address => uint8) scores;
    address public teacher;

    constructor(address _teacher) {
        teacher = _teacher;
    }

    event ScoreAddLog(address student,uint8 score);

    event ScoreUpdateLog(address student,uint8 before,uint8 now);

    error ScoreError(string msg);

    // 仅有teacher可以调用
    modifier onlyTeacher() {
        if (msg.sender != teacher) {
            revert ScoreError("only teacher can modify");
        }
        _;
    }

    modifier checkScore(uint8 _score) {
        if (_score > 100) {
            revert ScoreError("score must be less than 100");
        }
        _;
    }

    // 新增学生分数记录,添加防重校验
    function addScore(address _student, uint8 _score) external override onlyTeacher checkScore(_score) {
      scores[_student] = _score;
      emit ScoreAddLog(_student,_score);
    }

    // 更新学生分数,检查地址合法性
    function updateScore(address _student, uint8 _score)external override onlyTeacher checkScore(_score){
      require(_student != address(0),"student not found");
      scores[_student] = _score;
    }

    function getScore(address _student)external override view returns(uint8){
      return scores[_student];
    }
}
