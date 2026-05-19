import { onRequest } from "firebase-functions/v2/https";

export const api = onRequest((req, res) => {
  res.json({
    status: "ok",
    app: "ProofPoint",
    message: "backend alive",
    time: new Date().toISOString()
  });
});
import * as functions from "firebase-functions";

export const dashboard = functions.https.onRequest((req, res) => {
  res.set("Content-Type", "text/html");
  res.sendFile(__dirname + "/frontend-public-index.html");
});