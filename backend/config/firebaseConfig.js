// db.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbRHeEsSm1_7aNthn3GSkPBQwgArWVOYA",
  authDomain: "mealmate-test.firebaseapp.com",
  databaseURL: "https://mealmate-test-default-rtdb.firebaseio.com",
  projectId: "mealmate-test",
  storageBucket: "mealmate-test.appspot.com",
  messagingSenderId: "103662261610",
  appId: "1:103662261610:web:c1b983e0847474f8034113",
  measurementId: "G-Y7DWXQXNZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
