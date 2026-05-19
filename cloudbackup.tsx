"use client";

import { useEffect, useState } from "react";
import app from "../lib/firebase";
import { getDatabase, ref, get } from "firebase/database";

type DevicesMap = Record<string, string>;
type StolenMap = Record<string, { reportedAt: string }>;

export default function Page() {
  const [devices, setDevices] = useState<DevicesMap>({});
  const [stolen, setStolen] = useState<StolenMap>({});
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const db = getDatabase(app);
        const snapshot = await get(ref(db, "/"));
        const data = snapshot.val() || {};

        setDevices(data.devices || {});
        setStolen(data.stolen || {});
        setLastBackup(data.backup?.latest?.timestamp || null);

        console.log("Firebase loaded:", data);
      } catch (err) {
        console.error("Firebase error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <h1>Loading ProofPoint…</h1>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>ProofPoint</h1>
      <p>Firebase connected and data loaded.</p>

      <h2>Registered Devices</h2>
      {Object.keys(devices).length === 0 ? (
        <p>No registered devices.</p>
      ) : (
        <ul>
          {Object.entries(devices).map(([key, serial]) => (
            <li key={key}>
              {key} → {serial}
            </li>
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

      <LegitimacyCheck stolen={stolen} />

      <h2>System Backup</h2>
      <p>
        {lastBackup ? `Last backup: ${lastBackup}` : "No backup recorded."}
      </p>
    </div>
  );
}

function LegitimacyCheck({ stolen }: { stolen: StolenMap }) {
  const [serial, setSerial] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const checkSerial = () => {
    if (!serial.trim()) {
      setResult("⚠️ Enter a serial number.");
      return;
    }

    if (stolen[serial]) {
      setResult(
        `🚨 Serial "${serial}" IS reported stolen (reported at ${stolen[serial].reportedAt})`
      );
    } else {
      setResult(`✅ Serial "${serial}" is NOT reported stolen.`);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Public Legitimacy Check</h2>
      <input
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
        placeholder="Enter serial number"
        style={{ padding: 6, marginRight: 8 }}
      />
      <button onClick={checkSerial}>Check</button>
      {result && <p>{result}</p>}
    </div>
  );
}
