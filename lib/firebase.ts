// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import firebaseConfig from "../firebase-config.json";

const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Connect to local emulators in development
if (process.env.NODE_ENV === "development") {
  connectStorageEmulator(storage, "localhost", 9199); // Storage emulator
  console.log("🔥 Connected to Firebase Storage Emulator");
}

export default app;