// src/lib/firebase/client.ts
"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleAuthProvider = new GoogleAuthProvider();

// Initialize Firebase Cloud Messaging
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null


export { app, auth, db, googleAuthProvider, storage };

