import React, { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import "./styles/app.css";
import { ethers } from "ethers";
// ABIのインポート
import abi from "./utils/CreateTask.json";

// モーダル
import Modal from "react-modal";

// Firebase関係
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "./firebase";

import { Link, useNavigate } from "react-router-dom";

// MUI
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Eyecatch from "./components/Eyecatch";
import { width } from "@mui/system";

// ハンバーガーメニュー
import Menu from "./components/Menu";
import Wallet from "./components/Wallet";
import Storage from "./components/Storage";

Modal.setAppElement("#root");

const Top = () => {
  // チェックボックスの実装
  const [isChecked, setIsChecked] = React.useState(false);

  const changeIsChecked = (e) => {
    if (isChecked == false) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  // マイニング中にロード
  const [mineStatus, setMineStatus] = useState(null);
  const [metamaskError, setMetamaskError] = useState(null);

  // ユーザーのウォレット保存用状態変数
  const [currentAccount, setCurrentAccount] = useState("");

  // メッセージ保存用状態変数
  const [contentValue, setContentValue] = useState("");

  // 期日保存用状態変数
  const [dueValue, setDueValue] = useState("");

  // tasks保存用状態変数
  const [allTasks, setAllTasks] = useState([]);

  // 報酬額保存用状態変数
  const [bountyValue, setBountyValue] = useState([]);

  // タスク詳細保存用状態変数
  const [expressionValue, setExpressionValue] = useState([]);

  // 報酬送付先保存用状態変数
  const [riwarderValue, setRiwarderValue] = useState([]);

  // 成果物保存用状態変数
  const [outputValue, setOutputValue] = React.useState("0");

  // モーダル
  const [modalIsOpen, setIsOpen] = React.useState(false);

  // タスクID保存用状態変数
  const [idValue, setValue] = React.useState("0");

  // モーダル表示用インデックス・コンテンツ保存
  const [indexValue, setIndexValue] = React.useState(0);
  const [textValue, setTextValue] = React.useState(0);
  const [selectedItem, setSelectedItem] = useState("");

  // 成果物一覧保存用配列
  const [allLinks, setLinks] = useState([]);
  // 成果物投稿者
  const [allLinkHolders, setLinkHolders] = useState([]);
  // 成果物いいね数
  const [allLinkGoods, setLinkGoods] = useState([]);
  const [outputDataList, setOutputDataList] = useState([]);

  // Astar Mainnetアドレス保存用
  // const contractAddress = "0x980a80De95bc528b6e413516F881B78F1e474F41"
  // Astarアドレス保存用
  // const contractAddress = "0x113FA87E7D8c4C4eA49956943C2dcc8659ABF6FA"

  // rinkebyテスト用
  // const contractAddress = "0x59CF146881B9191c51b38e5990834a0779E07a90"

  // 新testnet(Rinekby)
  const contractAddress = "0xC45Cb7eCe0823bCD1df7Eaf6275462fAe114EFbD";

  // ABIの参照
  const ContractABI = abi.abi;

  // Firebase表示用
  const [users, setUsers] = useState([]);

  // タスクへのコメント保存用状態変数
  const [d, setData] = useState("");
  const comment = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData({ ...d, [name]: value });
  };

  // モーダルスタイル
  const modalStyle = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      // opacity: 0.7
    },
    content: {
      color: "black",
      textAlign: "center",
      position: "absolute",
      top: "5rem",
      left: "10%",
      right: "10%",
      bottom: "5rem",
      backgroundColor: "paleturquoise",
      borderRadius: "1rem",
      padding: "1.5rem",
    },
  };

  // タスクの表示に使う
  useEffect(() => {
    const usersCollectionRef = collection(firebaseFirestore, "people");
    // リアタイ更新
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsub;
  }, []);

  // タスク登録
  const handleTask = async () => {
    // event.preventDefault();
    const usersCollectionRef = collection(firebaseFirestore, "task");
    const newDoc = doc(usersCollectionRef).id;
    console.log(newDoc);
    const documentRef = await setDoc(doc(usersCollectionRef, newDoc), {
      // usersCollectionRef.doc(newDoc).set({
      user: currentAccount,
      content: contentValue,
      due: dueValue,
      name: expressionValue,
      id: newDoc,
    });
  };
  // コンテンツ表示
  const setText = async (index) => {
    const usersDocumentRef = collection(firebaseFirestore, "task");
    await getDocs(
      query(
        usersDocumentRef,
        where("content", "==", allTasks[index].content),
        where("due", "==", allTasks[index].due.toString())
      )
    ).then((snapshot) => {
      snapshot.forEach((doc) => {
        setTextValue(doc.data().name);
      });
    });
  };
  // 終わり

  // 成果物一覧表示
  const setOutput = async (index) => {
    const usersDocumentRef = collection(firebaseFirestore, "task");
    let taskId = 0;
    await getDocs(
      query(
        usersDocumentRef,
        where("content", "==", allTasks[index].content),
        where("due", "==", allTasks[index].due.toString())
      )
    ).then((snapshot) => {
      snapshot.forEach((doc) => {
        taskId = doc.data().id;
        console.log(taskId);
      });
    });

    const usersLinkRef = collection(firebaseFirestore, `task/${taskId}/output`);
    var num = 0;
    var comments = [];
    await getDocs(query(usersLinkRef)).then((snapshot) => {
      snapshot.forEach(async (doc) => {
        await outputDataList.push(doc.data());
        setLinks(outputDataList);
        // コメント表示のため、outputに紐づくコメントを配列に追加
        const usersCommentsRef = collection(
          firebaseFirestore,
          `task/${taskId}/output/${doc.id}/comment`
        );
        await getDocs(query(usersCommentsRef)).then((snapshot1) => {
          snapshot1.forEach((doc1) => {
            comments.push(doc1.data());
          });
        });
        // 確定：outputdatalistにコメント欄を追加
        outputDataList[num]["comment"] = comments;
        console.log(num);
        console.log(outputDataList[num]["comment"]);
        console.log(outputDataList[num]);
        num += 1;
        // 配列を初期化
        comments = [];
      });
    });

    // 成果物を全て配列に入れる
    await getDocs(query(usersLinkRef)).then((snapshot) => {
      snapshot.forEach((doc) => {
        // setContentValue(doc.data().link)
        // console.log(allLinks);
        allLinks.push(doc.data().link);
        setLinks(allLinks);
      });
    });
    await getDocs(query(usersLinkRef)).then((snapshot) => {
      snapshot.forEach((doc) => {
        allLinkHolders.push(doc.data().userid);
        setLinkHolders(allLinkHolders);
      });
    });
    await getDocs(query(usersLinkRef)).then((snapshot) => {
      snapshot.forEach((doc) => {
        allLinkGoods.push(doc.data().like);
        setLinkGoods(allLinkGoods);
      });
    });
    setOutputValue("");
  };
  // 終わり

  const getAllTasks = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
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
            done: task.done,
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

  // タスク登録時イベント
  useEffect(() => {
    let taskContract;

    const onNewTask = (user, due, content, bounty, done) => {
      console.log("NewTask", user, due, content, bounty, done);
      // alert(`「${content}」を登録しました。頑張りましょう🔥🚀`);
      setAllTasks((prevState) => [
        ...prevState,
        {
          user: user,
          due: due,
          content: content,
          bounty: bounty,
          done: done,
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

  // タスク完了時イベント
  useEffect(() => {
    let taskContract;

    const onDoneTask = (user, index) => {
      console.log("Done.", user, index);
      // alert(`タスク完了おめでとうございます！🔥🚀`);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      taskContract = new ethers.Contract(contractAddress, ContractABI, signer);
      taskContract.on("DoneTask", onDoneTask);
    }

    return () => {
      if (taskContract) {
        taskContract.off("DoneTask", onDoneTask);
      }
    };
  }, []);

  // console.log("currentAccount: ", currentAccount);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const network = await ethereum.request({ method: "eth_chainId" });

    if (accounts.length !== 0 && network.toString() === "0x4") {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setMetamaskError(false);
      setCurrentAccount(account);
      getAllTasks();
    } else {
      setMetamaskError(true);
      console.log("No authorized account found");
    }
  };

  const connectWallet2 = async () => {
    setCurrentAccount(Wallet)
    if (currentAccount != null) {
      console.log("成功です")
      console.log(currentAccount)
    } else {
      console.log("失敗です")
    }
  }

  const connectWallet = async () => {
    // if (currentAccount != null) {
    //   console.log("成功です")
    //   console.log(currentAccount)
    // } else {
    //   console.log("失敗です")
    // }

    const { ethereum } = window;
    setMineStatus("connecting");

    if (!ethereum) {
      alert(
        "Metamaskがインストールされていないようです🥺スマホでご利用の方は、Metamaskアプリ内ブラウザからご利用ください🙇‍♂️"
      );
    }

    try {
      const network = await ethereum.request({ method: "eth_chainId" });

      if (network.toString() === "0x4") {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Found an account! Address: ", accounts[0]);
        setMetamaskError(null);
        setCurrentAccount(accounts[0]);
        setMineStatus("ok");
      } else {
        // alert(
        //   "Rinkeby testnetとは異なるネットワークに接続されているようです🥺Metamaskアプリから、ネットワークをRinkeby testnetに切り替えてリトライしてください🙇‍♂️"
        // );
        // setMetamaskError(true);
        // setMineStatus("e");
        // 追記開始
        // console.log(0x + Number(4).toString(16))
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${Number(4).toString(16)}` }]
          });
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'Rinkeby Testnet',
                  chainId: ethers.utils.hexlify(4),
                  nativeCurrency: { name: 'RinkebyETH', decimals: 18, symbol: 'ETH' },
                  rpcUrls: ['https://rinkeby.etherscan.io/']
                }
              ]
            });
          }
        }
        // 追記終わり
      }
    } catch (err) {
      console.log(err);
      setMineStatus("e");
    }
  };

  // task生成
  const task = async () => {
    try {
      setMineStatus("mining");
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

        // ETH送るコントラクト
        console.log(
          "Contract balance:",
          ethers.utils.formatEther(contractBalance)
        );

        // トランザクションへの書き込み
        const options = { value: ethers.utils.parseEther(bountyValue) };
        const taskTxn = await taskContract.createTask(
          currentAccount,
          dueValue,
          contentValue,
          options
        );
        console.log("Mining...", taskTxn.hash);
        await taskTxn.wait();
        console.log("Mined -- ", taskTxn.hash);
        setMineStatus("success");
      } else {
        setMineStatus("error");
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setMineStatus("error");
      console.log(error);
      if (error.toString().match(/string/)) {
        alert("エラーです🥺フォームが空欄の可能性があります。ご確認ください🙇‍♂️");
      } else {
        if (error.toString().match(/decimal/)) {
          alert(
            "エラーです🥺「報酬」欄は数字になっていますか…？ご確認ください🙇‍♂️"
          );
        } else {
          if (error.toString().match(/object/)) {
            console.log(error);
          } else {
            alert(
              `エラーです🥺記入内容を確認してみてください。例：「報酬」欄は数字になっていますか…？
                      ▼今回のエラーメッセージ
                    ${error}`
            );
          }
        }
      }
    }
  };

  // task完了
  const done = async (index, riwarderValue) => {
    console.log(index);
    if (allTasks[index].done !== false) {
      alert(
        `「${allTasks[index].content}」は既に完了しています、別のタスクを探してみてね🚀`
      );
    }
    try {
      const { ethereum } = window;
      if (ethereum && riwarderValue != "") {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskContract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );

        // 完了前のコントラクトの資金量確認
        let contractBalance = await provider.getBalance(taskContract.address);
        console.log(
          "Contract balance:",
          ethers.utils.formatEther(contractBalance)
        );

        // トランザクションへの書き込み
        const taskTxn = await taskContract.sendRiward(index, riwarderValue);
        console.log("Mining...", taskTxn.hash);
        await taskTxn.wait();
        console.log("Mined -- ", taskTxn.hash);

        // 完了後のコントラクトの資金量確認
        console.log(
          "Contract balance:",
          ethers.utils.formatEther(contractBalance)
        );
      } else {
        alert(
          `報酬の送付先が指定されていません🥺　コントラクトアドレスを入力してください！`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 成果物提出
  const output = async (indexValue) => {
    // ドキュメントIDを取得
    console.log(indexValue);
    const usersDocumentRef = collection(firebaseFirestore, "task");
    getDocs(
      query(
        usersDocumentRef,
        where("content", "==", allTasks[indexValue].content),
        where("due", "==", allTasks[indexValue].due.toString())
      )
    ).then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(allTasks[indexValue].content);
        // idを文字列に保存
        setValue(doc.data().id);
        // console.log("doc id", doc.data().id)
        // console.log("id value", idValue)
      });
    });
  };

  const addLink = async (idValue) => {
    // Outputがなかった場合はアラートを出して処理を中断
    try {
      if (outputValue != "") {
        // IDからさらにコレクションを~~Refに保存
        const usersLinkRef = collection(
          firebaseFirestore,
          `task/${idValue}/output`
        );
        console.log(`task/${idValue}/output`);
        console.log(usersLinkRef);

        // ~~Refにリンクを登録、IDつきで
        const newDoc = doc(usersLinkRef).id;
        console.log(newDoc);
        const documentRef = await setDoc(doc(usersLinkRef, newDoc), {
          id: newDoc,
          link: outputValue,
          userid: currentAccount,
          like: 0,
        });
      } else {
        alert(`成果物を入力してください`);
      }
    } catch (error) {
      alert("エラーが発生しました");
    }
  };

  // 成果物へのコメント追加
  const addComment = async (userid, link, text) => {
    // どの成果物に対してコメントしようとしているかを特定(userid,linkから検索、成果物idを変数に格納)
    const linkRef = collection(firebaseFirestore, "task");

    // コメントが空白であればアラートを出して終了、空白でなければ登録処理を行う
    if (text != null) {
      // タスクidを特定
      await getDocs(
        query(
          linkRef,
          where("user", "==", allTasks[indexValue].user.toLowerCase()),
          where("content", "==", allTasks[indexValue].content),
          where("due", "==", allTasks[indexValue].due.toString())
        )
      ).then((snapshot) => {
        snapshot.forEach(async (doc1) => {
          console.log(snapshot);
          // idを文字列に保存
          console.log(doc1.data().id);
          // 特定したidからoutputidを特定
          const outputRef = await collection(
            firebaseFirestore,
            `task/${doc1.data().id}/output`
          );
          console.log(`task/${doc1.data().id}/output`);
          await getDocs(
            query(
              outputRef,
              where("userid", "==", userid),
              where("link", "==", link)
            )
          ).then((snapshot) => {
            snapshot.forEach(async (doc2) => {
              // output/(id)/commentコレクションを作成
              const usersCommentRef = await collection(
                firebaseFirestore,
                `task/${doc1.data().id}/output/${doc2.data().id}/comment`
              );
              console.log(
                `task/${doc1.data().id}/output/${doc2.data().id}/comment`
              );
              // コレクション内にコメントを登録
              try {
                const newDoc = doc(usersCommentRef).id;
                console.log(newDoc);
                const documentRef = await setDoc(doc(usersCommentRef, newDoc), {
                  id: newDoc,
                  userid: currentAccount,
                  comment: text,
                });
              } catch (error) {
                console.log("エラーです");
              }
            });
          });
        });
      });
      alert(`「${text}」をコメントとして登録しました！`);
    } else {
      alert("コメントが記入されていません🥺");
    }
  };

  // コメントの内容をDBに追加

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    }
  }, []);

  const navigate = useNavigate();
  function switchNetwork(e) {
    e.target.checked ? navigate("/") : navigate("/fuji");
  }
  return (
    <div>
      <Menu width={250} ></Menu>
      <div>
        {currentAccount && (
          <button className="account" onClick={null}>
            {currentAccount.slice(0, 6)}...{currentAccount.slice(-6)}
          </button>
        )}
        {!currentAccount && mineStatus !== "connecting" && (
          <button className="account" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
      <div className="mainContainer">
        <div className="dataContainer">
          {metamaskError && (
            <div className="metamask-error">
              Rinkeby Testnetに <br></br>接続してください!
            </div>
          )}
          <Eyecatch version="Rinkeby" unit="$ETH" checked={true} />

          {/* <Storage /> */}

          <br />

          <FormControlLabel
            label="完了済のタスクを非表示"
            value="ribbon"
            control={
              <Checkbox
                color="info"
                checked={isChecked}
                onChange={changeIsChecked}
                name="toggleDisplayAll"
              />
            }
          />

          <br />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* ウォレット接続時のローディング */}
            <br></br>
            <div className="mine-submission">
              {mineStatus === "ok" && (
                <div className={mineStatus}>{window.location.reload()}</div>
              )}
              {mineStatus === "connecting" && (
                <div className="mining">
                  <div className="loader" />
                  <span>Transaction is mining</span>
                </div>
              )}
              {mineStatus === "e" && (
                <div className="error">
                  <p>Transaction failed. Please try again.</p>
                </div>
              )}
            </div>
            {currentAccount && mineStatus !== "mining" && (
              <button
                className="waveButton"
                onClick={() => {
                  setSelectedItem("create");
                }}
              >
                タスクを作成する
              </button>
            )}
          </div>

          {/* mining時にロード画面にする実装 */}
          <br></br>
          <div className="mine-submission">
            {mineStatus === "success" && (
              <div className={mineStatus}>
                <p>success!</p>
              </div>
            )}
            {mineStatus === "mining" && (
              <div className={mineStatus}>
                <div className="loader" />
                <span>Transaction is mining</span>
              </div>
            )}
            {mineStatus === "error" && (
              <div className={mineStatus}>
                <p>
                  Transaction failed. Make sure you have $ETH in your Metamask
                  wallet and try again.
                </p>
              </div>
            )}
          </div>

          {/* モーダルにするテスト */}
          <Modal
            isOpen={"create" === selectedItem}
            style={modalStyle}
            onRequestClose={() => setSelectedItem("")}
          >
            <h2>タスクの作成</h2>

            {currentAccount && (
              <textarea
                name="messageArea"
                className="form"
                placeholder="タスクを記入してください(例：コントラクトアドレスの変更)"
                type="text"
                id="message"
                value={contentValue}
                onChange={(e) => setContentValue(e.target.value)}
              />
            )}
            <br></br>

            {currentAccount && (
              <textarea
                name="messageArea"
                className="form"
                placeholder="期日を記入してください(例：20220507)"
                type="text"
                id="message"
                value={dueValue}
                onChange={(e) => setDueValue(e.target.value)}
              />
            )}
            <br></br>

            {currentAccount && (
              <textarea
                name="messageArea"
                placeholder="タスクの報酬額を記入してください(単位:ETH)"
                className="form"
                type="text"
                id="message"
                value={bountyValue}
                onChange={(e) => setBountyValue(e.target.value)}
              />
            )}
            <br></br>

            <textarea
              name="messageArea"
              placeholder="タスクの説明を記入してください(例：コントラクトを新たにデプロイし、アドレスを取得してください。提出時には新たなコントラクトアドレスの送付をお願いします)"
              className="form"
              type="text"
              id="expression"
              value={expressionValue}
              onChange={(e) => setExpressionValue(e.target.value)}
            />
            <br></br>
            {currentAccount && (
              <button
                className="submitButton"
                onClick={() => {
                  handleTask();
                  task();
                  setSelectedItem("");
                }}
              >
                タスクを作成する
              </button>
            )}
          </Modal>

          {currentAccount &&
            allTasks.slice(0).map((task, index) => {
              return (
                <div key={index} className="cover">
                  {/* setispenと合わせて別の関数を策定、idを渡す。このidをベースにtaskを特定して表示する関数を書く */}

                  {/* チェックされている場合、完了済のタスクは表示しない */}
                  {isChecked == true && task.done.toString() == "false" && (
                    <div>
                      <button
                        className="taskCard"
                        onClick={async () => {
                          setIndexValue(index);
                          setText(index);
                          await setOutput(index);
                          // setIsOpen(true);
                          setSelectedItem("task");
                          // outputの適切な挙動のため、ここで一度タスクIDを拾うための処理を入れる
                          output(index);
                        }}
                      >
                        投稿者: {task.user}
                        <br></br>
                        期日: {task.due.toString()}
                        <br></br>
                        タスク: {task.content}
                        <br></br>
                        報酬: {ethers.utils.formatEther(task.bounty)}ETH
                        <br></br>
                        完了: {task.done.toString()}
                        <br></br>
                        {/* ボタンの中 */}
                      </button>
                      {/* 詳細を押した際の挙動 */}
                      <Modal
                        isOpen={"task" === selectedItem}
                        style={modalStyle}
                        onRequestClose={() => {
                          setSelectedItem("");
                          setRiwarderValue("");
                          setLinks([]);
                          setLinkHolders([]);
                          setLinkGoods([]);
                          setOutputDataList([]);
                        }}
                      >
                        <div id="overlay">
                          {/* <div className="mainContainer">
                                        <div className="dataContainer">
                                            <div className="body"> */}
                          <h2>
                            タスク詳細
                            <br />
                          </h2>
                          <div className="modal">
                            タスク登録者▼
                            <br />
                            <div className="card">
                              {" "}
                              {allTasks[indexValue].user}
                            </div>
                            <br />
                            期日▼
                            <br />{" "}
                            <div className="card">
                              {allTasks[indexValue].due.toString()}
                            </div>
                            <br />
                            タスク▼
                            <div className="card">
                              {" "}
                              {allTasks[indexValue].content}
                            </div>
                            <br />
                            詳細説明▼<div className="card"> {textValue}</div>
                            <br />
                            報酬▼
                            <div className="card">
                              {" "}
                              {ethers.utils.formatEther(
                                allTasks[indexValue].bounty
                              )}
                              ETH
                            </div>
                            <br />
                            完了▼{" "}
                            <div className="card">
                              {allTasks[indexValue].done.toString()}
                            </div>
                            <br />
                            成果物:
                            <div style={{ overflowX: "auto" }}>
                              <table style={{ padding: 8, tableLayout: "fix" }}>
                                <thead>
                                  <tr className="table">
                                    <th
                                      scope="col"
                                      style={{ textAlign: "left" }}
                                      className="Button_col"
                                    >
                                      アドレス
                                    </th>
                                    <th
                                      scope="col"
                                      style={{ textAlign: "left" }}
                                      className="Button_col"
                                    >
                                      成果物
                                    </th>
                                    <th
                                      scope="col"
                                      style={{
                                        textAlign: "left",
                                        minWidth: "240px",
                                      }}
                                      className="Button_col"
                                    >
                                      コメント
                                    </th>

                                    {/* <th scope="col" className="Button_col">いいね</th> */}

                                    {currentAccount ==
                                      allTasks[
                                        indexValue
                                      ].user.toLowerCase() && (
                                        <th scope="col" className="Button_col">
                                          アドレス
                                        </th>
                                      )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {outputDataList.map((data, i) => (
                                    <tr>
                                      <td
                                        style={{
                                          textAlign: "left",
                                          verticalAlign: "top",
                                        }}
                                        data-label="アドレス"
                                      >
                                        <a
                                          key={i}
                                          className=""
                                          href={`https://etherscan.io/address/${data.userid}`}
                                          target="_blank"
                                        >
                                          {data.userid.slice(0, 5)}...
                                          <br />
                                          <br />
                                        </a>
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "left",
                                          verticalAlign: "top",
                                        }}
                                        data-label="成果物"
                                      >
                                        <a
                                          key={i}
                                          className=""
                                          href={data.link}
                                          target="_blank"
                                        >
                                          {" "}
                                          {data.link.slice(0, 15)}...
                                        </a>
                                      </td>
                                      <td
                                        data-label="コメント"
                                        style={{
                                          textAlign: "left",
                                          verticalAlign: "top",
                                        }}
                                      >
                                        {data.comment != null &&
                                          data.comment.map((com) => (
                                            <div>
                                              <p style={{ fontSize: 16 }}>
                                                {com.comment}
                                                <br />
                                                by{" "}
                                                <a
                                                  href={`https://etherscan.io/address/${com.userid}`}
                                                >
                                                  {com.userid.slice(0, 5)}...
                                                </a>
                                              </p>
                                            </div>
                                          ))}

                                        <div
                                          style={{
                                            marginTop: 24,
                                            marginBottom: 12,
                                            display: "flex",
                                          }}
                                        >
                                          <TextField
                                            style={{ marginRight: 12 }}
                                            id="outlined-error"
                                            label="コメント内容"
                                            defaultValue=""
                                            variant="standard"
                                            name={i.toString()}
                                            value={data.username}
                                            onChange={comment}
                                          />
                                          <Button
                                            variant="contained"
                                            style={{ minWidth: "100px" }}
                                            onClick={(e) => {
                                              addComment(
                                                data.userid,
                                                data.link,
                                                d[i]
                                              );
                                            }}
                                          >
                                            送信する
                                          </Button>
                                        </div>
                                      </td>
                                      <td
                                        style={{ verticalAlign: "top" }}
                                        data-label="いいね"
                                        className=""
                                      >
                                        {currentAccount ==
                                          allTasks[
                                            indexValue
                                          ].user.toLowerCase() && (
                                            <div>
                                              <button
                                                key={i}
                                                className="submitButton"
                                                onClick={() =>
                                                  done(indexValue, data)
                                                }
                                              >
                                                報酬を送付
                                              </button>
                                              <br></br>
                                            </div>
                                          )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* タスク提出 */}
                          <textarea
                            name="messageArea"
                            className="form"
                            placeholder="成果物のリンクを添付"
                            type="text"
                            id="riward"
                            value={outputValue}
                            onChange={(e) => setOutputValue(e.target.value)}
                          />
                          <br></br>
                          <button
                            className="submitButton"
                            onClick={(e) => {
                              output(indexValue);
                              console.log("id value", idValue);
                              addLink(idValue);
                              setOutput(index);
                              setOutputValue("");
                            }}
                          >
                            成果物を提出
                          </button>
                        </div>
                      </Modal>
                    </div>
                  )}

                  {isChecked == false && (
                    <div>
                      <button
                        className="taskCard"
                        onClick={() => {
                          setIndexValue(index);
                          setText(index);
                          setOutput(index);
                          // setIsOpen(true);
                          setSelectedItem("task");
                          // outputの適切な挙動のため、ここで一度タスクIDを拾うための処理を入れる
                          output(index);
                        }}
                      >
                        投稿者: {task.user}
                        <br></br>
                        期日: {task.due.toString()}
                        <br></br>
                        タスク: {task.content}
                        <br></br>
                        報酬: {ethers.utils.formatEther(task.bounty)}ETH
                        <br></br>
                        完了: {task.done.toString()}
                        <br></br>
                        {/* ボタンの中 */}
                      </button>
                      {/* 詳細を押した際の挙動 */}
                      <Modal
                        isOpen={"task" === selectedItem}
                        style={modalStyle}
                        onRequestClose={() => {
                          setSelectedItem("");
                          setRiwarderValue("");
                          setLinks([]);
                          setLinkHolders([]);
                          setLinkGoods([]);
                          setOutputDataList([]);
                        }}
                      >
                        <div id="overlay">
                          {/* <div className="mainContainer">
                                        <div className="dataContainer">
                                            <div className="body"> */}
                          <h2>
                            タスク詳細
                            <br />
                          </h2>
                          <div className="modal">
                            タスク登録者▼
                            <br />
                            <div className="card">
                              {" "}
                              {allTasks[indexValue].user}
                            </div>
                            <br />
                            期日▼
                            <br />{" "}
                            <div className="card">
                              {allTasks[indexValue].due.toString()}
                            </div>
                            <br />
                            タスク▼
                            <div className="card">
                              {" "}
                              {allTasks[indexValue].content}
                            </div>
                            <br />
                            詳細説明▼<div className="card"> {textValue}</div>
                            <br />
                            報酬▼
                            <div className="card">
                              {" "}
                              {ethers.utils.formatEther(
                                allTasks[indexValue].bounty
                              )}
                              ETH
                            </div>
                            <br />
                            完了▼{" "}
                            <div className="card">
                              {allTasks[indexValue].done.toString()}
                            </div>
                            <br />
                            成果物:
                            <div style={{ overflowX: "auto" }}>
                              <table style={{ padding: 8, tableLayout: "fix" }}>
                                <thead>
                                  <tr className="table">
                                    <th
                                      scope="col"
                                      style={{ textAlign: "left" }}
                                      className="Button_col"
                                    >
                                      アドレス
                                    </th>
                                    <th
                                      scope="col"
                                      style={{ textAlign: "left" }}
                                      className="Button_col"
                                    >
                                      成果物
                                    </th>
                                    <th
                                      scope="col"
                                      style={{
                                        textAlign: "left",
                                        minWidth: "240px",
                                      }}
                                      className="Button_col"
                                    >
                                      コメント
                                    </th>

                                    {/* <th scope="col" style={{textAlign: "left",}} className="Button_col">いいね</th> */}

                                    {currentAccount ==
                                      allTasks[
                                        indexValue
                                      ].user.toLowerCase() && (
                                        <th
                                          scope="col"
                                          style={{ textAlign: "left" }}
                                          className="Button_col"
                                        >
                                          報酬
                                        </th>
                                      )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {outputDataList.map((data, i) => (
                                    <tr
                                      style={{
                                        marginBottom: 24,
                                        padddingBottom: 24,
                                      }}
                                    >
                                      <td
                                        style={{
                                          textAlign: "left",
                                          verticalAlign: "top",
                                          paddingRight: 24,
                                        }}
                                        data-label="アドレス"
                                      >
                                        <a
                                          key={i}
                                          className=""
                                          href={`https://etherscan.io/address/${data.userid}`}
                                          target="_blank"
                                        >
                                          {data.userid.slice(0, 5)}...
                                          <br />
                                          <br />
                                        </a>
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "left",
                                          verticalAlign: "top",
                                          paddingRight: 24,
                                        }}
                                        data-label="成果物"
                                      >
                                        <a
                                          key={i}
                                          className=""
                                          href={data.link}
                                          target="_blank"
                                        >
                                          {" "}
                                          {data.link.slice(0, 15)}...
                                        </a>
                                      </td>
                                      <td
                                        data-label="コメント"
                                        style={{
                                          textAlign: "left",
                                          verticalAlign: "top",
                                        }}
                                      >
                                        {data.comment != null &&
                                          data.comment.map((com) => (
                                            <div>
                                              <p style={{ fontSize: 16 }}>
                                                {com.comment}
                                                <br />
                                                by{" "}
                                                <a
                                                  href={`https://etherscan.io/address/${com.userid}`}
                                                >
                                                  {com.userid.slice(0, 5)}...
                                                </a>
                                              </p>
                                            </div>
                                          ))}

                                        <div
                                          style={{
                                            marginTop: 24,
                                            marginBottom: 12,
                                            display: "flex",
                                          }}
                                        >
                                          <TextField
                                            style={{ marginRight: 12 }}
                                            id="outlined-error"
                                            label="コメント内容"
                                            defaultValue=""
                                            variant="standard"
                                            name={i.toString()}
                                            value={data.username}
                                            onChange={comment}
                                          />
                                          <Button
                                            variant="contained"
                                            style={{ minWidth: "100px" }}
                                            onClick={(e) => {
                                              addComment(
                                                data.userid,
                                                data.link,
                                                d[i]
                                              );
                                            }}
                                          >
                                            送信する
                                          </Button>
                                        </div>
                                      </td>
                                      <td
                                        style={{ verticalAlign: "top" }}
                                        data-label="いいね"
                                        className=""
                                      >
                                        {currentAccount ==
                                          allTasks[
                                            indexValue
                                          ].user.toLowerCase() && (
                                            <div>
                                              <button
                                                key={i}
                                                className="submitButton"
                                                onClick={() =>
                                                  done(indexValue, data)
                                                }
                                              >
                                                報酬を送付
                                              </button>
                                              <br></br>
                                            </div>
                                          )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* タスク提出 */}
                          <textarea
                            name="messageArea"
                            className="form"
                            placeholder="成果物のリンクを添付"
                            type="text"
                            id="riward"
                            value={outputValue}
                            onChange={(e) => setOutputValue(e.target.value)}
                          />
                          <br></br>
                          <button
                            className="submitButton"
                            onClick={(e) => {
                              output(indexValue);
                              console.log("id value", idValue);
                              addLink(idValue);
                              setOutput(indexValue);
                              setOutputValue("");
                            }}
                          >
                            成果物を提出
                          </button>
                        </div>
                      </Modal>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Top;
