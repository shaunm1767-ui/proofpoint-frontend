"use client"

import { useState } from "react"
import { storage, firestore, auth } from "../../../lib/firebase" // <- relative path fixed
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function AddItemPage() {
  const [itemName, setItemName] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [invoice, setInvoice] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const uploadFile = async (file: File, path: string) => {
    if (!file) return null
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return url
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!auth.currentUser) return alert("You must be logged in!")

    try {
      setLoading(true)

      // Upload photo and invoice to Firebase Storage
      const photoURL = photo
        ? await uploadFile(photo, `users/${auth.currentUser.uid}/photos/${photo.name}`)
        : null
      const invoiceURL = invoice
        ? await uploadFile(invoice, `users/${auth.currentUser.uid}/invoices/${invoice.name}`)
        : null

      // Save item info to Firestore
      await addDoc(collection(firestore, "items"), {
        userId: auth.currentUser.uid,
        itemName,
        serialNumber,
        photoURL,
        invoiceURL,
        stolen: false,
        createdAt: serverTimestamp(),
      })

      alert("Item registered successfully!")

      // Reset form
      setItemName("")
      setSerialNumber("")
      setPhoto(null)
      setInvoice(null)
    } catch (err) {
      console.error(err)
      alert("Error uploading item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h1>Register New Device</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label>Item Name</label>
          <br />
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="MacBook Pro / Camera / Bike"
            style={{ width: "100%", padding: 10 }}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Serial Number</label>
          <br />
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Enter serial number"
            style={{ width: "100%", padding: 10 }}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Item Photo</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Proof of Purchase / Invoice</label>
          <br />
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setInvoice(e.target.files?.[0] || null)}
          />
        </div>

        <button type="submit" style={{ padding: 12 }} disabled={loading}>
          {loading ? "Registering..." : "Register Item"}
        </button>
      </form>
    </div>
  )
}