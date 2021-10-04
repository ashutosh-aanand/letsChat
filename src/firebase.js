import firebase from "firebase/app";
import "firebase/auth";

require('dotenv').config();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const auth = firebase.initializeApp({
    apiKey: process.env.REACT_APP_firebase_api_key,
    authDomain: process.env.REACT_APP_firebase_auth_domain,
    projectId: process.env.REACT_APP_firebase_projectID,
    storageBucket: process.env.REACT_APP_firebase_storage_bucket,
    messagingSenderId: process.env.REACT_APP_firebase_messaging_senderID,
    appId: process.env.REACT_APP_firebase_appID,
    measurementId: process.env.REACT_APP_firebase_measurementID
  }).auth();
