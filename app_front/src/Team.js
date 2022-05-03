import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import './App.css';
// import { ethers } from "ethers";

const Team = () => {
    const [contentValue, setContentValue] = useState([]);
    const [currentAccount, setCurrentAccount] = useState("");
    const { ethereum } = window;

    const accounts = ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        // setCurrentAccount(account)
    } else {
        console.log("No authorized account found")
    }
    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">
                    チーム登録
                </div>
                <div className="bio">
                    チームを登録しよう！🔥🚀
                </div>
                <br />
                Sample!
                <br />
                <Link to={`/`}>Go To App</Link>
                <br />

                Sample!
                <br />
                <Link to={`/sample`}>Go To Sample</Link>
                <br />

                <button className="waveButton" onClick={null}>
                    タスクを作成する
                </button>
                <br />
                <textarea name="messageArea"
                    placeholder="タスクを記入してください"
                    type="text"
                    id="message"
                    value={contentValue}
                    onChange={e => setContentValue(e.target.value)} />

            </div>
        </div>

    );
}

export default Team;

