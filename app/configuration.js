// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyAOpBC_2jEJgFHfqa7VatpPEqWTY5NzAb0",
  authDomain: "beleaf-a5dff.firebaseapp.com",
  databaseURL: "https://beleaf-a5dff-default-rtdb.firebaseio.com",
  projectId: "beleaf-a5dff",
  storageBucket: "beleaf-a5dff.firebasestorage.app",
  messagingSenderId: "373664710924",
  appId: "1:373664710924:web:83f525e2683d5501bf4929",
  measurementId: "G-QQ8REM5QWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Realtime Database
const database = getDatabase(app);

export { auth, database };
export default app;