"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";

interface Device {
  deviceName: string;
  serialNumber: string;
  description?: string;
  photos?: string[];
  proofOfPurchase?: string;
  registeredAt?: string;
}

export default function RegisteredDevices() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const devicesRef = ref(db, `users/${uid}/devices`);

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const deviceList: Device[] = Object.values(data);
      setDevices(deviceList);
    });

    return () => unsubscribe();
  }, []);

  if (!auth.currentUser) return <p>Please log in to view devices</p>;

  return (
    <div>
      <h2>Registered Devices</h2>
      {devices.length === 0 && <p>No devices registered yet.</p>}
      {devices.map((dev, idx) => (
        <div key={idx} style={{ marginBottom: 20, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
          <strong>{dev.deviceName}</strong> — {dev.serialNumber} <br />
          {dev.description && <em>{dev.description}</em>} <br />
          {dev.registeredAt && <small>Registered: {dev.registeredAt}</small>} <br />
          {dev.photos?.map((url) => (
            <img key={url} src={url} width={100} style={{ marginRight: 5, marginTop: 5 }} />
          ))}
          {dev.proofOfPurchase && (
            <div>
              Invoice: <a href={dev.proofOfPurchase} target="_blank">View</a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}