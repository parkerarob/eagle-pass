import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRvcXezwE7pZl71CrLR-CoMHc7ljbZPJE",
  authDomain: "eaglepass-dev.firebaseapp.com",
  projectId: "eaglepass-dev",
  storageBucket: "eaglepass-dev.firebasestorage.app",
  messagingSenderId: "218859983940",
  appId: "1:218859983940:web:3d2cb6e9deebd47efa9811",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
