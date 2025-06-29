import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRvcXezwE7pZl71CrLR-CoMHc7ljbZPJE",
  authDomain: "eaglepass-dev.firebaseapp.com",
  projectId: "eaglepass-dev",
  storageBucket: "eaglepass-dev.firebasestorage.app",
  messagingSenderId: "218859983940",
  appId: "1:218859983940:web:664723b95728ba7efa9811",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  // Core instances
  app,
  auth,
  db,
  // Auth
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  // Firestore
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  onSnapshot,
  // Types
};
export type { User };
