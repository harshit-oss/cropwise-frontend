// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:            "AIzaSyCI5_qHJZwnvGPTBdiwJv10IkDkOHkU0tU",
  authDomain:        "cropwise-c9e19.firebaseapp.com",
  projectId:         "cropwise-c9e19",
  storageBucket:     "cropwise-c9e19.firebasestorage.app",
  messagingSenderId: "635209532644",
  appId:             "1:635209532644:web:e6ff612029910d605b58f1",
};

const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;