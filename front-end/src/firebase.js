// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRNxs0r7tMHz7C-6j792HCcy9ErH8IMMk",
  authDomain: "smart-edu-44bc0.firebaseapp.com",
  projectId: "smart-edu-44bc0",
  storageBucket: "smart-edu-44bc0.appspot.com",
  messagingSenderId: "56289520795",
  appId: "1:56289520795:web:fa1ed7796b3a5833d86a3e",
  measurementId: "G-3CPDVCTLLD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;