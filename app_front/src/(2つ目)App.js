import React, { useEffect, useState } from "react";
import "./styles/app.css";
import { ethers } from "ethers";
// ABIのインポート
import abi from "./utils/CreateTask.json";
const App = () => {
  // ユーザーのウォレット保存用状態変数
  const [currentAccount, setCurrentAccount] = useState("");

  // メッセージ保存用状態変数
  const [contentValue, setContentValue] = useState("");

  // waves保存用状態変数
  const [allTasks, setAllTasks] = useState([]);
  console.log("currentAccount: ", currentAccount);

  // コントラクトアドレス保存用
  const contractAddress = "0x238b18A37BfB4922460fD1f46fe3b16BB503C512";

  // ABIの参照
  const ContractABI = abi.abi;

  const getAllTasks = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // ここから再開
        const taskContract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );
        const tasks = await taskContract.getAllTasks();
        const tasksCleaned = tasks.map((task) => {
          return {
            user: task.user,
            due: task.due,
            content: task.content,
            bounty: task.bounty,
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

  useEffect(() => {
    let taskContract;

    const onNewTask = (user, due, content, bounty) => {
      console.log("NewTask", user, due, content, bounty);
      setAllTasks((prevState) => [
        ...prevState,
        {
          user: task.user,
          due: task.due,
          content: task.content,
          bounty: task.bounty,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const taskContract = new ethers.Contract(
        contractAddress,
        ContractABI,
        signer
      );
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
        setCurrentAccount(account);
        getAllTasks();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const task = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskContract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );

        // 最終追記分
        let contractBalance = await provider.getBalance(taskContract.address);
        console.log(
          "Contract balance:",
          ethers.utils.formatEther(contractBalance)
        );

        // 追記分
        const taskTxn = await taskContract.wave(contentValue, {
          gasLimit: 300000,
        });
        console.log("Mining...", taskTxn.hash);
        await taskTxn.wait();
        console.log("Mined -- ", taskTxn.hash);
        // 追記分終わり
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="hand-wave">
            👋
          </span>{" "}
          WELCOME!
        </div>
        <div className="bio">
          イーサリアムウォレットを接続して、メッセージを作成したら、
          <span role="img" aria-label="hand-wave">
            👋
          </span>
          を送ってください
          <span role="img" aria-label="shine">
            ✨
          </span>
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
            Wave at Me
          </button>
        )}
        {currentAccount && (
          <textarea
            name="messageArea"
            placeholder="メッセージはこちら"
            type="text"
            id="message"
            value={contentValue}
            onChange={(e) => setContentValue(e.target.value)}
          />
        )}

        {currentAccount &&
          allTasks
            .slice(0)
            .reverse()
            .map((wave, index) => {
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#F8F8FF",
                    marginTop: "16px",
                    padding: "8px",
                  }}
                >
                  <div>Address: {wave.address}</div>
                  <div>Time: {wave.timestamp.toString()}</div>
                  <div>Message: {wave.message}</div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
export default App;
