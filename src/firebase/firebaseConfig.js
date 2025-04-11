// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDg5WhdbhP0EMoNgFy_PEd41gZgnxKoCQ4",
  authDomain: "guestease-8a11c.firebaseapp.com",
  projectId: "guestease-8a11c",
  storageBucket: "guestease-8a11c.firebasestorage.app",
  messagingSenderId: "1047397018695",
  appId: "1:1047397018695:web:79178619ef016caa2c5562",
  measurementId: "G-EGEE260KHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firestore database instance for storing app data
const db = getFirestore(app);

// Firebase authentication instance for user authentication
const auth = getAuth(app);

//const analytics = getAnalytics(app);


export { app, db, auth };