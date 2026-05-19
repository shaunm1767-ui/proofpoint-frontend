import React from "react";

interface DevicesDisplayProps {
  devices: Record<string, string>;
  stolen: Record<string, { reportedAt: string }>;
}

export default function DevicesDisplay({ devices, stolen }: DevicesDisplayProps) {
  return (
    <div className="p-2 border rounded space-y-4">
      <h3>Registered Devices</h3>
      {Object.keys(devices).length ? (
        <ul>
          {Object.entries(devices).map(([key, serial]) => (
            <li key={key}>
              {key} → {serial}
            </li>
          ))}
        </ul>
      ) : (
        <p>No registered devices.</p>
      )}

      <h3>Stolen Devices</h3>
     
