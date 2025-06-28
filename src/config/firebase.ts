import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlXOlLNVBK5LxubKADVBYWzpV9-r29qyo",
  authDomain: "quick-ee-mart.firebaseapp.com",
  projectId: "quick-ee-mart",
  storageBucket: "quick-ee-mart.firebasestorage.app",
  messagingSenderId: "443304093278",
  appId: "1:443304093278:web:676570a64581f9f0fd36cf",
  measurementId: "G-6L1F5H6JZJ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
