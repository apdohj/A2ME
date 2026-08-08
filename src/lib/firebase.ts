import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDsqzHvX9NUYSsv57wSqGP8Le0xt9bUsrs",
  authDomain: "a2me-a760b.firebaseapp.com",
  projectId: "a2me-a760b",
  storageBucket: "a2me-a760b.firebasestorage.app",
  messagingSenderId: "188634463518",
  appId: "1:188634463518:web:adbe9e4f4c5ad3a6461d0f",
  measurementId: "G-J43GEZLELE",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
