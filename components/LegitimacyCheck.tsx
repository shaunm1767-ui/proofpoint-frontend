"use client";

import { useState } from "react";

type StolenMap = Record<string, { reportedAt: string }>;

export default function LegitimacyCheck({ stolen }: { stolen: StolenMap }) {
  const [serial, setSerial] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleCheck = () => {
    if (!serial.trim()) return;
    if (stolen[serial]) {
      setResult(`❌ ${serial} is reported stolen!`);
    } else {
      setResult(`✅ ${serial} is legitimate.`);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Public Legitimacy Check</h2>
      <input
        type="text"
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
        placeholder="Enter serial number"
        style={{ padding: 8, fontSize: 16, marginRight: 8 }}
      />
      <button
        onClick={handleCheck}
        style={{
          padding: "8px 16px",
          fontSize: 16,
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        Check
      </button>
      {result && <p style={{ marginTop: 10 }}>{result}</p>}
    </div>
  );
}
