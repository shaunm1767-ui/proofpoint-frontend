"use client";

import SystemStatus from "@/components/SystemStatus";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, db } from "../lib/firebase";
// Components
import Login from "../components/Login";
import CloudBackup from "../components/CloudBackup";
import LegitimacyCheck from "../components/LegitimacyCheck";
import TestUploader from "../components/TestUploader";

// Types
type DevicesMap = Record<string, string>;
type StolenMap = Record<string, { reportedAt: string }>;

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [devices, setDevices] = useState<DevicesMap>({});
  const [stolen, setStolen] = useState<StolenMap>({});
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load user data
  useEffect(() => {
    if (!user) return;

    const deduplicateStolen = (stolenData: StolenMap) => {
      const unique: StolenMap = {};
      Object.entries(stolenData).forEach(([serial, info]) => {
        if (!unique[serial]) unique[serial] = info;
      });
      return unique;
    };

    const loadData = async () => {
      setLoading(true);
      try {
        const snapshot = await get(ref(db, `/users/${user.uid}`));
        const data = snapshot.val() || {};
        setDevices(data.devices || {});
        setStolen(deduplicateStolen(data.stolen || {}));
        setLastBackup(data.backup?.latest?.timestamp || null);
      } catch (err) {
        console.error("Firebase error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleBackupComplete = async (timestamp: string) => {
    setLastBackup(timestamp);
    if (user) {
      try {
        await set(ref(db, `/users/${user.uid}/backup/latest`), { timestamp });
        console.log("Backup timestamp saved for user:", user.email);
      } catch (err) {
        console.error("Failed to save backup:", err);
      }
    }
    alert("System Backup complete ✅");
  };

  if (authLoading) return <h1>Loading ProofPoint…</h1>;
  if (!user) return <Login onLoginSuccess={() => setUser(auth.currentUser)} />;
  if (loading) return <h1>Loading user data…</h1>;

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>ProofPoint</h1>
      <p>Firebase connected and data loaded.</p>
      <p>Logged in as: {user.email}</p>

      {/* Test Uploader always visible */}
      <TestUploader />

      <h2>Registered Devices</h2>
      {Object.keys(devices).length === 0 ? (
        <p>No registered devices.</p>
      ) : (
        <ul>
          {Object.entries(devices).map(([key, serial]) => (
            <li key={key}>{key} → {serial}</li>
          ))}
        </ul>
      )}

      <h2>Stolen Devices</h2>
      {Object.keys(stolen).length === 0 ? (
        <p>No stolen devices reported.</p>
      ) : (
        <ul>
          {Object.entries(stolen).map(([serial, info]) => (
            <li key={serial}>
              🚨 {serial} — reported at {info.reportedAt}
            </li>
          ))}
        </ul>
      )}

      {/* Firebase components */}
      <LegitimacyCheck stolen={stolen} />
      <CloudBackup setLastBackup={handleBackupComplete} />

      <h2>System Backup</h2>
      <p>{lastBackup ? `Last backup: ${lastBackup}` : "No backup recorded."}</p>
    </div>
  );
}