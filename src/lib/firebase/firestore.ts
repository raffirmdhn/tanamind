// src/lib/firebase/firestore.ts
import { db } from './client';
import { doc, deleteDoc, collection, getDocs, writeBatch, query } from 'firebase/firestore';

// Function to delete a plant and all its subcollections (growth_reports, watering_logs)
export async function deletePlantAndSubcollections(userId: string, plantId: string): Promise<void> {
  const plantDocRef = doc(db, `users/${userId}/plants/${plantId}`);

  // Helper function to delete all documents in a subcollection
  const deleteSubcollection = async (subcollectionName: string) => {
    const subcollectionRef = collection(db, `users/${userId}/plants/${plantId}/${subcollectionName}`);
    const q = query(subcollectionRef);
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  };

  try {
    // Delete subcollections first
    await deleteSubcollection('growth_reports');
    await deleteSubcollection('watering_logs');

    // Then delete the plant document itself
    await deleteDoc(plantDocRef);
    console.log(`Plant ${plantId} and its subcollections deleted successfully.`);
  } catch (error) {
    console.error("Error deleting plant and subcollections: ", error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

// Add other Firestore utility functions here as needed
// e.g., addPlant, getPlants, addGrowthReport, etc.
