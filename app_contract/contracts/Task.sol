// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// contract CreateTeam {
//     struct Team {
//         uint256 id;
//         address owner;
//         string name;
//     }
//     Team[] public teams;

//     // チーム作成
//     function createTeam(
//         string _name;
//     ) public {
//         uint _id = 0;
//         _owner = msg.sender;
//         teams.push(Team(_id,_owner,_name));
//         emit NewTeam(_id,_owner,_name);
//     }
// }

contract CreateTask {
    // タスクを構造体として登録。タスクは期限(日付)と報酬(ether)と内容(テキスト)と担当者(address)を持つ
    // ユーザーがタスクを登録するための関数を実装。
    // タスクの期日がきたら、自動的に登録されている担当者に報酬を配分。支払い先はデフォでタスク作成者。アウトプットが出ていればタスク実行者に担当者を振替。

    // イベントを設定。フロントで新たにタスクを登録した時に発火する.今後コントラクトを新たにデプロイ、ABIを変更、フロントを変更という作業が残っている
    event NewTask(
        address user,
        uint256 due,
        string content,
        uint256 bounty,
        bool done
    );
    event DoneTask(address user, uint256 index);

    struct Task {
        address user;
        uint256 due;
        string content;
        uint256 bounty;
        bool done;
    }
    Task[] public tasks;

    // タスク作成
    function createTask(
        address _user,
        uint256 _due,
        string memory _content // uint256 _bounty
    ) public payable {
        _user = msg.sender;
        // _user.transfer(100);
        uint256 _bounty = msg.value;
        bool _done = false;
        tasks.push(Task(_user, _due, _content, _bounty, _done));

        emit NewTask(_user, _due, _content, _bounty, _done);
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

    // タスク完了者への報酬分配
    function sendRiward(uint256 _index) public payable {
        require(tasks[_index].done == false, "Already done.");
        // コントラクト作成者を特定
        address payable _user = payable(msg.sender);
        // コントラクト作成者へ、タスクのbountyと同値の報酬を送付
        _user.transfer(tasks[_index].bounty);
        // タスクのuserを作成者へ変更
        // タスクを完了判定する(=構造体に完了可否データを保持)
        //
        tasks[_index].done = true;
        emit DoneTask(_user, _index);
    }
}
