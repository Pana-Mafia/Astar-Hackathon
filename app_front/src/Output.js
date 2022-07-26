import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/app.css";
// import { ethers } from "ethers";

// ハンバーガーメニュー
import Menu from "./components/Menu";
import { Button } from "@mui/material";

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
import { onSnapshot } from "firebase/firestore";

const Output = () => {
  const [contentValue, setContentValue] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const { ethereum } = window;

  const [output, setOutput] = useState([]);
  const [comment, setComment] = useState([]);

  const accounts = ethereum.request({ method: "eth_accounts" });
  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log("Found an authorized account:", account);
    // setCurrentAccount(account)
  } else {
    console.log("No authorized account found");
  }

  useEffect(() => {
    const usersCollectionRef = collection(firebaseFirestore, "task/iiZPlgAz8PNkjSqupBeB/output");
    const usersCommentRef = collection(firebaseFirestore, "task/iiZPlgAz8PNkjSqupBeB/output/3vctl9JlgtuG2RCKlpYx/comment");
    // リアタイ更新
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      setOutput(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    const com = onSnapshot(usersCommentRef, (querySnapshot) => {
      setComment(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    console.log(unsub)
    console.log(output)
    return unsub;
  }, []);

  const test = () => {
    console.log(output)
  }

  return (
    <div>
      <Menu width={250} ></Menu>
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">Output</div>
          <div className="bio">See what you've done before!🔥🚀</div>
          <div>
            <br />
            <h3>
              <Link className="link" to={`/`}>Go To Top</Link>
            </h3>


          </div>

          <h3>
            ▼Your Project
          </h3>

          <Button className="taskCard">
            Taskal開発
          </Button>
          <br />
          <Button className="taskCard">
            XXX
          </Button>
          <br />
          <Button className="taskCard">
            XXX
          </Button>
          <br />

          <h3>
            ▼Your Output
          </h3>
          <h4>
            タスク：XXX
          </h4>

          {output.slice(0).map((out, index) => {
            return (
              <div>
                <div key={index} className="cover">
                  <Button className="output" onClick={test} href={out.link} target='blank'>
                    {out.link.slice(0, 20)}...
                  </Button>
                </div>
              </div>
            )
          })}

          <h4>
            タスク：XXX
          </h4>
          <Button className="output" onClick={null} >
            AAAA
          </Button>

          <h4>
            タスク：YYY
          </h4>
          <Button className="output" onClick={null} >
            AAAA
          </Button>


          <br />
          <br />
          <br />
          <h3>
            ▼Comments
          </h3>

          {comment.slice(0).map((com, index) => {
            return (
              <div key={index} className="cover">
                <Button className="comment" onClick={test}>
                  {com.comment}
                </Button>
              </div>
            )
          })}

        </div>
      </div>
    </div >
  );
};

export default Output;
