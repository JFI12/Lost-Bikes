


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyB6_XZ8MTo-z_LtShxCAxPhvRSvvwriMgg",
  authDomain: "stolen-bikes-5d664.firebaseapp.com",
  projectId: "stolen-bikes-5d664",
  storageBucket: "stolen-bikes-5d664.appspot.com",
  messagingSenderId: "256078269191",
  appId: "1:256078269191:web:72401a6a7e4768435cd3a2",
  measurementId: "G-EJ4N1CFLJX"
};

// Initialize Firebase
let app;
  
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = firebase.firestore(app);
const auth = firebase.auth();



export { db, auth, firebase };
export const FrameNumbersRef = db.collection("Frame Numbers")