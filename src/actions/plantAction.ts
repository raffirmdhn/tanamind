// app/actions/plantAction.ts
"use server";

import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { revalidatePath } from "next/cache";

type AddPlantParams = {
  userId: string;
  name: string;
  species: string;
  plantingDate: Date;
  notes?: string;
  photo?: File;
};

export async function addPlant(data: AddPlantParams) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);
  const storage = getStorage(firebaseServerApp);

  try {
    // 1. Buat dokumen tanaman terlebih dahulu (tanpa gambar)
    const plantRef = await addDoc(collection(db, `users/${data.userId}/plants`), {
      userId: data.userId,
      name: data.name,
      species: data.species,
      plantingDate: Timestamp.fromDate(data.plantingDate),
      notes: data.notes || "",
      imageUrl: "", // sementara kosong
      createdAt: Timestamp.now(),
    });

    let imageUrl: string | undefined = undefined;

    // 2. Jika ada gambar, upload dan update dokumen
    if (data.photo) {
      const file = data.photo;
      // Get file extension from the original file name
      const extMatch = file.name.match(/\.(\w+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
      // Rename the file to "default.<ext>" before storing
      const fileRef = ref(storage, `plants/${data.userId}/${plantRef.id}/default.${ext}`);
      const snapshot = await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);

      // Update dokumen dengan URL gambar
      await updateDoc(doc(db, `users/${data.userId}/plants`, plantRef.id), {
        imageUrl,
      });
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Tanaman berhasil ditambahkan.",
      variant: "default",
      description: `${data.name} berhasil ditambahkan.`,
    };
  } catch (error: any) {
    console.error("Error adding plant:", error);
    return {
      success: false,
      message: "Gagal menambah tanaman.",
      variant: "destructive",
      description: error.message || "Terjadi kesalahan.",
    };
  }
}

type WateringPlantParams = {
  userId: string;
  plantId: string;
  notes?: string;
};

export async function wateringPlant(data: WateringPlantParams) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);
  const date = new Date();

  try {
    const wateringLogsRef = collection(
      db,
      `users/${data.userId}/plants/${data.plantId}/wateringLogs`
    );

    // Fetch the last watering log, ordered by date descending, limited to 1.
    const lastLogQuery = query(wateringLogsRef, orderBy("date", "desc"), limit(1));
    const lastLogSnap = await getDocs(lastLogQuery);

    let streak = 1;
    if (!lastLogSnap.empty) {
      const lastLogData = lastLogSnap.docs[0].data();
      const lastWateringDate = lastLogData.date.toDate();
      const currentDate = date;

      // Calculate the difference in days, considering only the date portion.
      const diffInDays = Math.floor(
        (currentDate.setHours(0, 0, 0, 0) - lastWateringDate.setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 1) {
        //If watered one day after the last time, increase the streak
        streak = (lastLogData.streak || 1) + 1;
      } else if (diffInDays > 1) {
        //If watered more than one day after the last time, reset the streak
        streak = 1;
      }
      // If diffInDays is 0, we don't change the streak.  This handles multiple waterings on the same day.
    }

    const newWateringDate = serverTimestamp();
    // Add the new watering log entry.
    await addDoc(wateringLogsRef, {
      date: newWateringDate, // Use serverTimestamp() here
      notes: data.notes || "",
      streak: streak,
    });

    // Update the lastWateringDate in the plant document.
    const plantRef = doc(db, `users/${data.userId}/plants/${data.plantId}`);
    await updateDoc(plantRef, {
      lastWateringDate: newWateringDate,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/plants/${data.plantId}`);

    return {
      success: true,
      message: "Penyiraman berhasil dicatat.",
      variant: "default",
      description: `Penyiraman pada ${date.toLocaleDateString()} berhasil.`,
    };
  } catch (error: any) {
    console.error("Error watering plant:", error);
    return {
      success: false,
      message: "Gagal mencatat penyiraman.",
      variant: "destructive",
      description: error.message || "Terjadi kesalahan.",
    };
  }
}

type GrowthReportParams = {
  userId: string;
  plantId: string;
  conditionRate: number;
  additionalNotes?: string;
  recommendedActions?: string;
  photo?: File;
};

export async function addGrowthReport(data: GrowthReportParams) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);
  const storage = getStorage(firebaseServerApp);

  try {
    let imageUrl = "";

    // Upload photo if provided
    if (data.photo) {
      const file = data.photo;
      const extMatch = file.name.match(/\.(\w+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
      const fileRef = ref(
        storage,
        `plants/${data.userId}/${data.plantId}/growthReports/${Date.now()}.${ext}`
      );
      const snapshot = await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Add growth report document
    const growthReportsRef = collection(
      db,
      `users/${data.userId}/plants/${data.plantId}/growthReports`
    );
    await addDoc(growthReportsRef, {
      conditionRate: data.conditionRate,
      additionalNotes: data.additionalNotes || "",
      recommendedActions: data.recommendedActions || "",
      date: serverTimestamp(),
      imageUrl,
    });

    // Update plant document with latest conditionRate, additionalNotes, recommendedActions
    const plantRef = doc(db, `users/${data.userId}/plants/${data.plantId}`);
    await updateDoc(plantRef, {
      conditionRate: data.conditionRate,
      additionalNotes: data.additionalNotes || "",
      recommendedActions: data.recommendedActions || "",
    });

    revalidatePath("/dashboard");
    revalidatePath(`/plants/${data.plantId}`);

    return {
      success: true,
      message: "Laporan pertumbuhan berhasil ditambahkan.",
      variant: "default",
      description: "Laporan pertumbuhan berhasil dicatat.",
    };
  } catch (error: any) {
    console.error("Error adding growth report:", error);
    return {
      success: false,
      message: "Gagal menambah laporan pertumbuhan.",
      variant: "destructive",
      description: error.message || "Terjadi kesalahan.",
    };
  }
}

type DeletePlantParams = {
  userId: string;
  plantId: string;
};
// Function to delete a plant and all its subcollections and storage files
export async function deletePlant({ plantId, userId }: DeletePlantParams) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);
  const storage = getStorage(firebaseServerApp);

  const plantDocRef = doc(db, `users/${userId}/plants/${plantId}`);

  // Helper function to delete all documents in a subcollection
  const deleteSubcollection = async (subcollectionName: string) => {
    const subcollectionRef = collection(
      db,
      `users/${userId}/plants/${plantId}/${subcollectionName}`
    );
    const q = query(subcollectionRef);
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  };

  try {
    // Delete subcollections first
    // Todo: Uncomment this if you want to delete the subcollections
    await deleteSubcollection("growthReports");
    await deleteSubcollection("wateringLogs");

    // 2. Delete ALL storage files under the plant's folder
    const plantStorageRef = ref(storage, `plants/${userId}/${plantId}`);

    // List ALL files recursively in the plant's folder
    const listResult = await listAll(plantStorageRef);

    // Delete each file found
    await Promise.all(listResult.items.map(fileRef => deleteObject(fileRef)));

    console.log(`Deleted ${listResult.items.length} storage files for plant ${plantId}`);

    // Then delete the plant document itself
    await deleteDoc(plantDocRef);
    console.log(`Plant ${plantId} and its subcollections deleted successfully.`);

    // Revalidate the dashboard page
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Tanaman berhasil dihapus.",
      variant: "default",
      description: "Tanaman dan semua data terkait berhasil dihapus.",
    };
  } catch (error: any) {
    console.error("Error deleting plant and subcollections: ", error);
    return {
      success: false,
      message: "Gagal menghapus tanaman.",
      variant: "destructive",
      description: error.message || "Terjadi kesalahan saat menghapus tanaman.",
    };
  }
}
