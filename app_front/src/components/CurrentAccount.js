import React from 'react';
import { useEffect, useState } from "react";

// Firebase関係
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "/Users/gtyuki/Desktop/web3/Astar_Hackathon/app_front/src/firebase";

export const CurrentAccount = async (address) => {
  // ニックネームの格納
  var userName = "0"
  // 処理①
  // const getUser = async () => {
  userName = "うわ"
  // ログイン中のユーザーのアドレス作成
  // await checkIfWalletIsConnected();
  const usersCollectionRef = collection(firebaseFirestore, "user");

  // ユーザーのアドレスがDBに存在するか判定

  const docSnap = await getDocs(query(
    usersCollectionRef,
    where("address", "==", address.toString())
  ));
  // あった場合：ニックネームの有無を判定
  if (docSnap.size >= 1) {
    console.log("あった！")
    docSnap.forEach(async (doc) => {
      console.log("存在する場合：ニックネームを取得")
      // ニックネームがある場合はニックネームを入れる
      if (doc.data().name != null) {
        userName = doc.data().name
        console.log("1")
      } else {
        // ニックネームがなければアドレスを入れる
        userName = doc.data().address
      }
    });
  } else {
    console.log("ない。。")
    console.log("存在しない場合：ユーザーのアドレスをDBに登録")
    // 存在しない場合：ユーザーのアドレスをDBに登録
    const newDoc = doc(usersCollectionRef).id;
    console.log(newDoc);
    const documentRef = await setDoc(doc(usersCollectionRef, newDoc), {
      // usersCollectionRef.doc(newDoc).set({
      address: address,
    });
    userName = address;
  }
  console.log("getUser終了")
  alert(userName)
  // 処理②
  // DBにあるアドレスを取得
  // ニックネームがある場合は表示
  // ニックネームの登録(編集)フォームを表示
  return ({ userName })
};


export default CurrentAccount;
