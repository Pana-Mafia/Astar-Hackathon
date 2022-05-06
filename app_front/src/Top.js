import React, { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore"
import { Link } from 'react-router-dom';
import './App.css';
import { ethers } from "ethers";
// ABIのインポート
import abi from './utils/CreateTask.json';

// モーダル
import Modal from "react-modal";

// Firebase関係
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
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

    // 報酬送付先保存用状態変数
    const [riwarderValue, setRiwarderValue] = useState([]);

    // 成果物保存用状態変数
    const [outputValue, setOutputValue] = useState([]);

    // モーダル
    const [modalIsOpen, setIsOpen] = React.useState(false);

    // タスクID保存用状態変数
    const [idValue, setValue] = React.useState("0");

    // モーダル表示用インデックス・コンテンツ保存
    const [indexValue, setIndexValue] = React.useState(0);
    const [textValue, setTextValue] = React.useState(0);

    // 成果物一覧保存用配列
    const [allLinks, setLinks] = useState([]);

    // Astarアドレス保存用
    // const contractAddress = "0x980a80De95bc528b6e413516F881B78F1e474F41"
    // rinkeby保存用
    const contractAddress = "0x5617b6BA58A2fcA6969B0e75A05E21C1A5840F8a"

    // ABIの参照
    const ContractABI = abi.abi;

    // Firebase表示用
    const [users, setUsers] = useState([]);

    // タスクの表示に使う
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

    // タスク登録
    const handleTask = async () => {
        // event.preventDefault();
        const usersCollectionRef = collection(firebaseFirestore, 'task');
        const newDoc = doc(usersCollectionRef).id
        console.log(newDoc)
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
        const usersDocumentRef = collection(firebaseFirestore, 'task');
        await getDocs(query(usersDocumentRef, where('content', '==', allTasks[index].content), where('due', '==', allTasks[index].due.toString()))).then(snapshot => {
            snapshot.forEach(doc => {
                setTextValue(doc.data().name)
            })
        })
    }
    // 終わり

    // 成果物一覧表示
    const setOutput = async (index) => {
        const usersDocumentRef = collection(firebaseFirestore, 'task');
        let taskId = 0;
        await getDocs(query(usersDocumentRef, where('content', '==', allTasks[index].content), where('due', '==', allTasks[index].due.toString()))).then(snapshot => {
            snapshot.forEach(doc => {
                taskId = doc.data().id
                console.log(taskId)
            })
        })

        const usersLinkRef = collection(firebaseFirestore, `task/${taskId}/output`);
        // 成果物を全て配列に入れる
        await getDocs(query(usersLinkRef)).then(snapshot => {
            snapshot.forEach(doc => {
                // setContentValue(doc.data().link)
                console.log(allLinks);
                allLinks.push(doc.data().link);
                setLinks(allLinks);
            })
        })
    }
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
    const done = async (index, riwarderValue) => {
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
                const taskTxn = await taskContract.sendRiward(index, riwarderValue)
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

    // 成果物提出
    const output = async (indexValue) => {

        // ドキュメントIDを取得 
        console.log(indexValue)
        const usersDocumentRef = collection(firebaseFirestore, 'task');
        getDocs(query(usersDocumentRef, where('content', '==', allTasks[indexValue].content), where('due', '==', allTasks[indexValue].due.toString()))).then(snapshot => {
            snapshot.forEach(doc => {
                console.log(allTasks[indexValue].content)
                // idを文字列に保存
                setValue(doc.data().id)
                // console.log("doc id", doc.data().id)
                // console.log("id value", idValue)
            })
        })
    };

    const addLink = async (idValue) => {
        // IDからさらにコレクションを~~Refに保存
        const usersLinkRef = collection(firebaseFirestore, `task/${idValue}/output`);
        console.log(`task/${idValue}/output`)
        console.log(usersLinkRef)

        // ~~Refにリンクを登録、IDつきで
        const newDoc = doc(usersLinkRef).id
        console.log(newDoc)
        const documentRef = await setDoc(doc(usersLinkRef, newDoc), {
            id: newDoc,
            link: outputValue,
        });
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">
                    <h1 className="heading gradient-text">
                        <span role="img" aria-label="hand-wave">🚀</span> Task Manager🚀
                    </h1>
                </div>
                <div className="bio">
                    タスクを管理しよう！🔥🚀
                </div>

                {/* <br />
                <Link to={`/sample`}>サンプルページはこちら</Link>
                <Link to={`/team`}>チームの登録はこちら</Link>
                <br /> */}

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
                    placeholder="タスクの説明を記入してください"
                    type="text"
                    id="expression"
                    value={expressionValue}
                    onChange={e => setExpressionValue(e.target.value)} />

                {currentAccount && (
                    allTasks.slice(0).map((task, index) => {
                        return (
                            <div key={index} className="card">
                                {/* <div>担当者: {task.user}</div>
                                <div>期日: {task.due.toString()}</div>
                                <div>タスク: {task.content}</div>
                                <div>報酬: {ethers.utils.formatEther(task.bounty)}ether</div>
                                <div>完了: {task.done.toString()}</div> */}
                                {/* setispenと合わせて別の関数を策定、idを渡す。このidをベースにtaskを特定して表示する関数を書く */}
                                <button className="taskCard" onClick={() => {
                                    setIndexValue(index);
                                    setText(index);
                                    setOutput(index);
                                    setIsOpen(true);
                                    // outputの適切な挙動のため、ここで一度タスクIDを拾うための処理を入れる
                                    output(index);
                                }}>
                                    <div>担当者: {task.user}</div>
                                    <div>期日: {task.due.toString()}</div>
                                    <div>タスク: {task.content}</div>
                                    <div>報酬: {ethers.utils.formatEther(task.bounty)}ether</div>
                                    <div>完了: {task.done.toString()}</div>
                                    {/* ボタンの中 */}
                                </button>
                                {/* 詳細を押した際の挙動 */}
                                <Modal isOpen={modalIsOpen} className="body">
                                    <div className="mainContainer">
                                        <div className="dataContainer">
                                            <div className="body">
                                                タスク詳細<br />
                                                <div>タスク登録者: {allTasks[indexValue].user}</div>
                                                <div>期日: {allTasks[indexValue].due.toString()}</div>
                                                <div>タスク: {allTasks[indexValue].content}</div>
                                                <div>詳細説明: {textValue}</div>
                                                <div>報酬: {ethers.utils.formatEther(allTasks[indexValue].bounty)}ether</div>
                                                <div>完了: {allTasks[indexValue].done.toString()}</div>
                                                成果物:
                                                <div>
                                                    {allLinks.map((link, i) => <div key={i} style="card">{link}</div>)}
                                                </div>

                                                {/* タスク提出 */}
                                                <textarea name="messageArea"
                                                    placeholder="成果物のリンクを添付"
                                                    type="text"
                                                    id="riward"
                                                    value={outputValue}
                                                    onChange={e => setOutputValue(e.target.value)} />
                                                <br></br>
                                                <button className="waveButton" onClick={() => {
                                                    output(indexValue);
                                                    console.log("id value", idValue);
                                                    addLink(idValue);
                                                }}>成果物を提出</button>

                                                {/* 報酬送付 */}
                                                <br></br>
                                                <textarea name="messageArea"
                                                    placeholder="報酬を送りたいアカウントのアドレスを記入してください"
                                                    type="text"
                                                    id="riward"
                                                    value={riwarderValue}
                                                    onChange={e => setRiwarderValue(e.target.value)} />
                                                <br></br>
                                                <button className="waveButton" onClick={() => done(index, riwarderValue)}>報酬を送付</button>
                                                <br></br>
                                                <br></br>
                                                <button onClick={() => {
                                                    setIsOpen(false);
                                                    setLinks([]);
                                                }}>Close Modal</button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            </div >)
                    })
                )}
            </div >
        </div >
    )
};


export default Top; 