import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8tBsiVATy86oRG-0t6xl78W4FShJB2PM",
  authDomain: "beleaf-ef6bb.firebaseapp.com",
  databaseURL: "https://beleaf-ef6bb-default-rtdb.firebaseio.com",
  projectId: "beleaf-ef6bb",
  storageBucket: "beleaf-ef6bb.firebasestorage.app",
  messagingSenderId: "900408739304",
  appId: "1:900408739304:web:54f79b18ccea4e4607505d",
  measurementId: "G-EL7L2VH2LM"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const database = getDatabase(app);
const db = getFirestore(app);


export { auth, database, db, app };


