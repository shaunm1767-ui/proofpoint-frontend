import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
console.log("Firebase initialized:", app.name);
