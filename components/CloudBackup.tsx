"use client";

import { useState, useEffect } from "react";
import app, { db, auth } from "../lib/firebase";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

type CloudBackupProps = {
  setLastBackup: (timestamp: string) => void;
};

export default function CloudBackup({ setLastBackup }: CloudBackupProps) {
  const [backingUp, setBackingUp] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);

    signInAnonymously(auth)
      .then(() => {
        console.log("Anonymous login successful ✅");
        setAuthReady(true);
      })
      .catch((err) => {
        console.error("Anonymous login failed ❌", err);
        alert("Firebase login failed. Check console.");
      });
  }, []);

  const handleBackup = async () => {
    if (!authReady) {
      alert("Firebase authentication not ready yet!");
      return;
    }

    setBackingUp(true);

    try {
      const timestamp = new Date().toISOString();

      const db = getDatabase(app);
      await set(ref(db, "/backup/latest"), { timestamp });

      // Update parent component state
      setLastBackup(timestamp);

      console.log("Backup complete:", timestamp);
      alert("Backup complete ✅");
    } catch (err) {
      console.error("Backup failed:", err);
      alert("Backup failed ❌");
    } finally {
      setBackingUp(false);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Cloud Backup</h2>
      <button onClick={handleBackup} disabled={backingUp || !authReady}>
        {backingUp ? "Backing up…" : "Backup Now"}
      </button>
    </div>
  );
}
