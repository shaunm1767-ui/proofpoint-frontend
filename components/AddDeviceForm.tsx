"use client";

import React, { useState } from "react";
import { ref as dbRef, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../lib/firebase";

const AddDeviceForm: React.FC = () => {
  const [deviceName, setDeviceName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [invoice, setInvoice] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(Array.from(e.target.files));
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setInvoice(e.target.files[0]);
  };

  const handleUpload = async (file: File, path: string) => {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("You must be logged in.");

    setLoading(true);
    try {
      // 1️⃣ Upload photos
      const photoUrls = await Promise.all(
        photos.map((file, idx) =>
          handleUpload(file, `users/${auth.currentUser?.uid}/devices/${serialNumber}/photo_${idx}`)
        )
      );

      // 2️⃣ Upload invoice
      let invoiceUrl = "";
      if (invoice) {
        invoiceUrl = await handleUpload(
          invoice,
          `users/${auth.currentUser?.uid}/devices/${serialNumber}/invoice.pdf`
        );
      }

      // 3️⃣ Save to Realtime Database
      await set(dbRef(db, `/users/${auth.currentUser.uid}/devices/${serialNumber}`), {
        name: deviceName,
        serial: serialNumber,
        description,
        photos: photoUrls,
        proofOfPurchase: invoiceUrl,
        registeredAt: new Date().toISOString(),
      });

      alert("Device registered successfully ✅");
      // Reset form
      setDeviceName("");
      setSerialNumber("");
      setDescription("");
      setPhotos([]);
      setInvoice(null);
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Device registration failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: 400 }}>
      <input
        type="text"
        placeholder="Device Name"
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Serial Number"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        required
      />
      <textarea
        placeholder="Describe my device (identifying marks)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <label>
        Photos of my device
        <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />
      </label>
      <label>
        Proof of Purchase / Invoice
        <input type="file" accept="application/pdf,image/*" onChange={handleInvoiceChange} />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Registering…" : "Register Item"}
      </button>
    </form>
  );
};

export default AddDeviceForm;