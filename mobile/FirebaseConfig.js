// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "cloudyway-49132.firebaseapp.com",
  databaseURL:
    "https://cloudyway-49132-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cloudyway-49132",
  storageBucket: "cloudyway-49132.firebasestorage.app",
  messagingSenderId: "472497959615",
  appId: process.env.FIREBASE_APP_ID,
  measurementId: "G-NNTMRVRKKM",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
