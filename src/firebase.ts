import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACa7lA37N812uOa1Irw9rzGuSNmMHghn4",
  authDomain: "site-voz-96e0b.firebaseapp.com",
  projectId: "site-voz-96e0b",
  storageBucket: "site-voz-96e0b.firebasestorage.app",
  messagingSenderId: "461573789885",
  appId: "1:461573789885:web:39091254f6e34b17a03fd4"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
