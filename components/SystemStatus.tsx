"use client";

import { useEffect, useState } from "react";

export default function SystemStatus() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch("https://us-central1-proofpoint-rfobg.cloudfunctions.net/dashboard")
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus("backend offline"));
  }, []);

  return (
    <div style={{ padding: 20, background: "#0f172a", color: "#fff", borderRadius: 12 }}>
      <h2>🧠 ProofPoint System Status</h2>
      <p>Backend: {status}</p>
      <p>Version: stable-baseline-auth-ui-2026-05-19</p>
    </div>
  );
}