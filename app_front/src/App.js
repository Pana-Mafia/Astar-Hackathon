import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
// ABIのインポート
import abi from './utils/CreateTask.json';
const App = () => {
  // ユーザーのウォレット保存用状態変数
  const [currentAccount, setCurrentAccount] = useState("");

  // メッセージ保存用状態変数
  const [contentValue, setContentValue] = useState("")

  // 期日保存用状態変数
  const [dueValue, setDueValue] = useState("")

  // tasks保存用状態変数
  const [allTasks, setAllTasks] = useState([]);

  // 報酬額保存用状態変数
  const [bountyValue, setBountyValue] = useState([]);


  // コントラクトアドレス保存用
  const contractAddress = "0x38fa16b1aEf3f15F2e320D0f2a021631A93Fa45f"

  // ABIの参照
  const ContractABI = abi.abi;

  const getAllTasks = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskContract = new ethers.Contract(contractAddress, ContractABI, signer);
        const tasks = await taskContract.getAllTasks();
        const tasksCleaned = tasks.map(task => {
          return {
            user: task.user,
            due: task.due,
            content: task.content,
            bounty: task.bounty,
            done: task.done
          };
        });
        setAllTasks(tasksCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   // イベント発生時にこれを使って画面を更新する、今使わない
  //   const onNewTask = (user, due, content, bounty) => {
  //     console.log("NewTask", user, due, content, bounty);
  //     setAllTasks(prevState => [
  //       ...prevState,
  //       {
  //         user: task.user,
  //         due: task.due,
  //         content: task.content,
  //         bounty: task.bounty
  //       },
  //     ]);
  //   };

  // }, []);

  useEffect(() => {
    let taskContract;

    const onNewTask = (user, due, content, bounty, done) => {
      console.log("NewTask", user, due, content, bounty, done);
      setAllTasks(prevState => [
        ...prevState,
        {
          user: user,
          due: due,
          content: content,
          bounty: bounty,
          done: done
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      taskContract = new ethers.Contract(contractAddress, ContractABI, signer);
      taskContract.on("NewTask", onNewTask);
    }

    return () => {
      if (taskContract) {
        taskContract.off("NewTask", onNewTask);
      }
    };
  }, []);

  console.log("currentAccount: ", currentAccount);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethreum object", ethereum);
      }
      // サイトにきたユーザーのアカウントを格納できる（複数格納可能のためaccountsと表記）
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        getAllTasks();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected: ", accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  // task生成
  const task = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskContract = new ethers.Contract(contractAddress, ContractABI, signer);

        // 最終追記分
        let contractBalance = await provider.getBalance(
          taskContract.address
        );

        // ETH送るコントラクト
        console.log(
          "Contract balance:",
          ethers.utils.formatEther(contractBalance)
        );

        // トランザクションへの書き込み
        const options = { value: ethers.utils.parseEther(bountyValue) }
        const taskTxn = await taskContract.createTask(currentAccount, dueValue, contentValue, options)
        console.log("Mining...", taskTxn.hash);
        await taskTxn.wait();
        console.log("Mined -- ", taskTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  };


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="hand-wave">🚀</span> Task Manager
        </div>
        <div className="bio">
          タスクを管理しよう！🔥🚀
        </div>
        <br />
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Wallet Connected
          </button>
        )}

        {currentAccount && (
          <button className="waveButton" onClick={task}>
            タスクを作成する
          </button>)}

        {currentAccount && (<textarea name="messageArea"
          placeholder="タスクを記入してください"
          type="text"
          id="message"
          value={contentValue}
          onChange={e => setContentValue(e.target.value)} />)
        }

        {currentAccount && (<textarea name="messageArea"
          placeholder="期日を記入してください"
          type="text"
          id="message"
          value={dueValue}
          onChange={e => setDueValue(e.target.value)} />)
        }

        {currentAccount && (<textarea name="messageArea"
          placeholder="タスクの報酬額(eth単位)を記入してください"
          type="text"
          id="message"
          value={bountyValue}
          onChange={e => setBountyValue(e.target.value)} />)
        }


        {currentAccount && (
          allTasks.slice(0).reverse().map((task, index) => {
            return (
              <div key={index} style={{ backgroundColor: "#F8F8FF", marginTop: "16px", padding: "8px" }}>
                <div>user: {task.user}</div>
                <div>due: {task.due.toString()}</div>
                <div>content: {task.content}</div>
                <div>bounty: {task.bounty.toString()}Wei</div>
                <div>bounty: {task.done.toString()}</div>
                <button className="waveButton" onClick={null}>詳細</button>
                <button className="waveButton" onClick={null}>提出</button>
              </div>)
          })
        )}
      </div>
    </div>
  );
}
export default App