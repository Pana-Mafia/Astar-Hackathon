// Import the functions you need from the SDKs you need
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDEvfuMijOI8OFYj2EujNEWssfdGOR_FDM",
    authDomain: "astar-hackathon.firebaseapp.com",
    projectId: "astar-hackathon",
    storageBucket: "astar-hackathon.appspot.com",
    messagingSenderId: "96662703318",
    appId: "1:96662703318:web:49bde86c285e1754698d77",
    measurementId: "G-F58GD1K2KW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseFirestore = getFirestore(app);