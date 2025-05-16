import { getApp, getApps, initializeApp } from "firebase/app";
import { getGenerativeModel, getVertexAI } from "firebase/vertexai";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize the Vertex AI service
const vertexAI = getVertexAI(app);

// Create a `GenerativeModel` instance with a model that supports your use case
export const model = getGenerativeModel(vertexAI, { model: "gemini-2.0-flash" });
