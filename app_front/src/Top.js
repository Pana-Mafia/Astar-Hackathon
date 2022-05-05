import React, { useEffect, useId, useState } from "react";
// ページ遷移用
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getFirestore, onSnapshot } from "firebase/firestore"
import { Link } from 'react-router-dom';
import './App.css';
import { ethers } from "ethers";
// ABIのインポート
import abi from './utils/CreateTask.json';

// モーダル
import Modal from "react-modal";

// Firebase関係
import { doc, addDoc, collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firebaseFirestore } from './firebase';


Modal.setAppElement("#root");
const Top = () => {

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

    // タスク詳細保存用状態変数
    const [expressionValue, setExpressionValue] = useState([]);

    // モーダル
    const [modalIsOpen, setIsOpen] = React.useState(false);

    // ID保存用状態変数
    const [idValue, setIdValue] = useState([]);

    // コントラクトアドレス保存用
    // const contractAddress = "0x980a80De95bc528b6e413516F881B78F1e474F41"
    // rinkeby保存用
    const contractAddress = "0xEcab270B6Dc488686fa3a292D526a182A516c39f"

    // ABIの参照
    const ContractABI = abi.abi;

    // Firebase表示用
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const usersCollectionRef = collection(firebaseFirestore, 'people');
        // リアタイ更新
        const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
            setUsers(
                querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
        });
        return unsub;

    }, []);
    // 提出練習
    const handleTask = async () => {
        // event.preventDefault();
        console.log(idValue, expressionValue);
        const usersCollectionRef = collection(firebaseFirestore, 'task');
        const documentRef = await addDoc(usersCollectionRef, {
            id: idValue,
            user: currentAccount,
            content: contentValue,
            due: dueValue,
            name: expressionValue,
        });
        console.log(documentRef);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { name, userid } = event.target.elements;
        console.log(name.value, userid.value);
        const usersCollectionRef = collection(firebaseFirestore, 'people');
        // クエリー
        const q = query(usersCollectionRef, where('userid', '==', "1"));
        console.log(q);
        // クエリー終わり
        const documentRef = await addDoc(usersCollectionRef, {
            name: name.value,
            userid: userid.value,
        });
        console.log(documentRef);
    };

    // 単一データ取得
    // const userDocumentRef = doc(firebaseFirestore, 'people', 'FABaAq5aZcFywChaqCh0');
    // getDoc(userDocumentRef).then((documentSnapshot) => {
    //     console.log(documentSnapshot.data());
    // });
    // 終わり

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

    // タスク登録時イベント
    useEffect(() => {
        let taskContract;

        const onNewTask = (user, due, content, bounty, done) => {
            console.log("NewTask", user, due, content, bounty, done);
            // alert(`「${content}」を登録しました。頑張りましょう🔥🚀`);
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

    // タスク完了時イベント
    useEffect(() => {
        let taskContract;

        const onDoneTask = (user, index) => {
            console.log("Done.", user, index);
        };
        // alert(`タスク完了おめでとうございます！🔥🚀`);

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

    // task完了
    const done = async (index) => {
        console.log(index)
        if (allTasks[index].done !== false) {
            alert(`「${allTasks[index].content}」は既に完了しています、別のタスクを探してみてね🚀`);
        }
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const taskContract = new ethers.Contract(contractAddress, ContractABI, signer);

                // 完了前のコントラクトの資金量確認
                let contractBalance = await provider.getBalance(
                    taskContract.address
                );
                console.log(
                    "Contract balance:",
                    ethers.utils.formatEther(contractBalance)
                );

                // トランザクションへの書き込み
                const taskTxn = await taskContract.sendRiward(index)
                console.log("Mining...", taskTxn.hash);
                await taskTxn.wait();
                console.log("Mined -- ", taskTxn.hash);

                // 完了後のコントラクトの資金量確認
                console.log(
                    "Contract balance:",
                    ethers.utils.formatEther(contractBalance)
                );

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    };

    const viewTask = async (index) => {
        console.log(index)
        console.log(modalIsOpen)
        setIsOpen(true)
        return (
            allTasks.slice(0).map((task, index) => {
                return (
                    <Modal isOpen={modalIsOpen}>
                        <div key={index} style={{ backgroundColor: "#F8F8FF", marginTop: "16px", padding: "8px" }}>
                            <div>担当者: {task.user}</div>
                            <div>期日: {task.due.toString()}</div>
                            <div>タスク: {task.content}</div>
                            <div>報酬: {ethers.utils.formatEther(task.bounty)}ether</div>
                            <div>完了: {task.done.toString()}</div>
                            <button onClick={() => setIsOpen(false)}>Close Modal</button>
                        </div >
                    </Modal>)
            })
        )
    };


    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

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
                <Link to={`/sample`}>サンプルページはこちら</Link>
                <Link to={`/team`}>チームの登録はこちら</Link>
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
                    <button className="waveButton" onClick={() => {
                        handleTask();
                        task();
                    }}>
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
                <textarea name="messageArea"
                    placeholder="タスクの番号を記入してください"
                    type="text"
                    id="id"
                    value={idValue}
                    onChange={e => setIdValue(e.target.value)} />
                <textarea name="messageArea"
                    placeholder="タスクの説明を記入してください"
                    type="text"
                    id="expression"
                    value={expressionValue}
                    onChange={e => setExpressionValue(e.target.value)} />

                {currentAccount && (
                    allTasks.slice(0).map((task, index) => {
                        return (
                            <div key={index} style={{ backgroundColor: "#F8F8FF", marginTop: "16px", padding: "8px" }}>
                                <div>担当者: {task.user}</div>
                                <div>期日: {task.due.toString()}</div>
                                <div>タスク: {task.content}</div>
                                <div>報酬: {ethers.utils.formatEther(task.bounty)}ether</div>
                                <div>完了: {task.done.toString()}</div>
                                {/* setispenと合わせて別の関数を策定、idを渡す。このidをベースにtaskを特定して表示する関数を書く */}
                                <button className="waveButton" onClick={() => {
                                    setIsOpen(true);
                                    viewTask(index);
                                }}>詳細</button>
                                {/* 詳細を押した際の挙動 */}
                                <Modal isOpen={modalIsOpen}>
                                    タスク詳細<br />
                                    <div>担当者: {task.user}</div>
                                    <div>期日: {task.due.toString()}</div>
                                    <div>タスク: {task.content}</div>
                                    <div>報酬: {ethers.utils.formatEther(task.bounty)}ether</div>
                                    <div>完了: {task.done.toString()}</div>
                                    <button onClick={() => setIsOpen(false)}>Close Modal</button>
                                </Modal>
                                <button className="waveButton" onClick={() => done(index)}>提出</button>
                            </div >)
                    })
                )}
            </div >
        </div >
    )
};


export default Top; 