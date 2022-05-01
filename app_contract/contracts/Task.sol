// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CreateTask {
    // タスクを構造体として登録。タスクは期限(日付)と報酬(ether)と内容(テキスト)と担当者(address)を持つ
    // ユーザーがタスクを登録するための関数を実装。
    // タスクの期日がきたら、自動的に登録されている担当者に報酬を配分。支払い先はデフォでタスク作成者。アウトプットが出ていればタスク実行者に担当者を振替。

    // イベントを設定。フロントで新たにタスクを登録した時に発火する.今後コントラクトを新たにデプロイ、ABIを変更、フロントを変更という作業が残っている
    event NewTask(address user, uint256 due, string content, uint256 bounty);

    struct Task {
        address user;
        uint256 due;
        string content;
        uint256 bounty;
    }
    Task[] public tasks;

    function createTask(
        address _user,
        uint256 _due,
        string memory _content // uint256 _bounty
    ) public payable {
        _user = msg.sender;
        // _user.transfer(100);
        uint256 _bounty = msg.value;
        tasks.push(Task(_user, _due, _content, _bounty));

        emit NewTask(_user, _due, _content, _bounty);
    }

    // 今あるタスクを一覧する
    function viewTask(uint256 _index)
        public
        view
        returns (
            address,
            uint256,
            string memory,
            uint256
        )
    {
        return (
            tasks[_index].user,
            tasks[_index].due,
            tasks[_index].content,
            tasks[_index].bounty
        );
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks;
    }
}
