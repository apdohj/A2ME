import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOp5VjKqwpXo5fMyNEQg-MWb8f1a33DK0",
  authDomain: "a2me0-e099e.firebaseapp.com",
  projectId: "a2me0-e099e",
  storageBucket: "a2me0-e099e.firebasestorage.app",
  messagingSenderId: "725233365016",
  appId: "1:725233365016:web:0029ad562978ef155e536d",
  measurementId: "G-HN8YTT8T12",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
