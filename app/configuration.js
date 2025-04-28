// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Your Firebase config using environment variables
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // Use the database URL from environment variable
  databaseURL: Constants.expoConfig?.extra?.firebaseDatabaseUrl || process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Realtime Database
const database = getDatabase(app);

// Function to test database connection
const testDatabaseConnection = async () => {
  try {
    // Create a reference to a test location
    const testRef = ref(database, 'connection_test');

    // Write a test value
    await set(testRef, {
      timestamp: Date.now(),
      status: 'connected'
    });

    // Read the value back
    const snapshot = await get(testRef);

    if (snapshot.exists()) {
      console.log('Database connection successful!');
      return true;
    } else {
      console.log('Database connection failed: No data found');
      return false;
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

export { auth, database, testDatabaseConnection };
export default app;