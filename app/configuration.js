
import { initializeApp } from "firebase/app";

// Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyBuuVNmWZW4FwAfpgW3LpXtx56-S90F850",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "beleaf-e9b79",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const cong = initializeApp(firebaseConfig);
export default cong;