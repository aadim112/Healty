import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDooRjImRtahoCMvmzmGoa_6qRJCdrh6PE",
  authDomain: "medtech-7594e.firebaseapp.com",
  databaseURL: "https://medtech-7594e-default-rtdb.firebaseio.com/", // Add this for Realtime Database
  projectId: "medtech-7594e",
  messagingSenderId: "1081554273882",
  appId: "1:1081554273882:web:31e3323e3bb7a774e63a63",
  measurementId: "G-T62WYKEXHR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize Firebase Database

export { database };
