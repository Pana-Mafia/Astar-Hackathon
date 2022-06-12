import React from 'react';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

// import { Hoge } from './components/CurrentAccount'

// Firebase関係
import {
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    snapshotEqual,
} from "firebase/firestore";
import { firebaseFirestore } from "./firebase";
import { CurrentAccount } from './components/CurrentAccount';
const Sample = () => {
    // ログイン中のユーザーアドレス取得
    const [currentAccount, setCurrentAccount] = useState("");

    // ニックネーム保存用状態変数
    const [namevalue, setName] = useState("");
    // ドキュメントID保存用
    const [docvalue, setDocValue] = useState("");

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

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
        }
    };

    // ニックネーム登録
    const changeName = async () => {
        const usersCollectionRef = collection(firebaseFirestore, "user");
        const docSnap = await getDocs(query(
            usersCollectionRef,
            where("address", "==", currentAccount.toString())
        ))
        docSnap.forEach((doc) => {
            // idを文字列に保存
            setDocValue(doc.data().id);
            console.log(doc.data().id)
        });
        const docRef = doc(firebaseFirestore, "user", "vCDK67HdqgrR6w59OVIM");
        docRef.update({
            name: namevalue
        })
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        // await setUserName(CurrentAccount(currentAccount.toString()));
        if (window.ethereum) {
            window.ethereum.on("chainChanged", (_chainId) =>
                window.location.reload()
            );
        }
    }, []);

    return (
        <div>
            Sample!
            <br></br>
            {currentAccount}
            <br />
            <Link to={`/`}>Go To App</Link>
            <br />

            <button onClick={
                () =>
                    // 処理①
                    // getUser
                    CurrentAccount(currentAccount.toString())

            } className="submitButton"></button>
            <br />
            Sample!
            <br />
            {/* <UserName address={() => currentAccount.toString()} /> */}
            <br />
            <Link to={`/`}>Go To App</Link>

            <br />
            {/* タスク提出 */}
            <textarea
                name="messageArea"
                className="form"
                placeholder="成果物のリンクを添付"
                type="text"
                id="riward"
                value={namevalue}
                onChange={(e) => setName(e.target.value)}
            />
            <br></br>
            <button
                className="submitButton"
                onClick={(e) => {
                    changeName(namevalue)
                    setName("")
                }}
            >
                成果物を提出
            </button>
        </div>

    );
}


export default Sample;

