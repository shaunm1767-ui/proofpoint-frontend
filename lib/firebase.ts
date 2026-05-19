import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// prevent SSR re-init crashes
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// ONLY run emulator in browser dev mode
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  try {
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("🔥 Storage Emulator Connected");
  } catch (e) {
    console.log("Storage emulator already connected");
  }
}

export default app;