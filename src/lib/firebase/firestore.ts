// src/lib/firebase/firestore.ts
import { db } from './client';
import { doc, deleteDoc, collection, getDocs, writeBatch, query } from 'firebase/firestore';

/**
 * Fungsi untuk menghapus tanaman dan semua subkoleksinya
 * @param userId - ID pengguna
 * @param plantId - ID tanaman yang akan dihapus
 */
export async function deletePlantAndSubcollections(userId: string, plantId: string): Promise<void> {
  const plantDocRef = doc(db, `users/${userId}/plants/${plantId}`);

  /**
   * Fungsi helper untuk menghapus semua dokumen dalam subkoleksi
   * @param subcollectionName - Nama subkoleksi yang akan dihapus
   */
  const deleteSubcollection = async (subcollectionName: string) => {
    const subcollectionRef = collection(db, `users/${userId}/plants/${plantId}/${subcollectionName}`);
    const q = query(subcollectionRef);
    const snapshot = await getDocs(q);
    
    // Gunakan batch write untuk menghapus semua dokumen sekaligus
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  };

  try {
    // Hapus subkoleksi terlebih dahulu
    await deleteSubcollection('growth_reports');
    await deleteSubcollection('watering_logs');

    // Kemudian hapus dokumen tanaman
    await deleteDoc(plantDocRef);
    console.log(`Plant ${plantId} and its subcollections deleted successfully.`);
  } catch (error) {
    console.error("Error deleting plant and subcollections: ", error);
    throw error; // Re-throw error untuk ditangani oleh pemanggil
  }
}

// Tambahkan fungsi utilitas Firestore lainnya di sini
// Contoh: addPlant, getPlants, addGrowthReport, dll.
