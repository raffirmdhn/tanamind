// src/lib/firebase/firestore.ts
import { Plant } from "@/types";
import { db as dbClient } from "./client";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
  query,
  Firestore,
  onSnapshot,
} from "firebase/firestore";

// Function to get all plants for a user
export async function getPlants(db: Firestore = dbClient, userId: string): Promise<any[]> {
  const plantsRef = collection(db, `users/${userId}/plants`);
  const q = query(plantsRef);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getPlantsSnapshot(cb: (data: Plant[]) => void, userId?: string) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return [];
  }
  if (!userId) {
    console.log("Error: userId is undefined");
    return [];
  }

  const plantsRef = collection(dbClient, `users/${userId}/plants`);
  const q = query(plantsRef);

  return onSnapshot(q, querySnapshot => {
    const results = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      };
    }) as unknown as Plant[];

    cb(results);
  });
}

// Add other Firestore utility functions here as needed
// e.g., addPlant, getPlants, addGrowthReport, etc.
