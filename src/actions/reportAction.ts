"use server";

import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import { model } from "@/lib/firebase/vertexai";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { revalidatePath } from "next/cache";

const dataset = `
[Dataset Pertumbuhan Sawi yang Sehat]

Informasi Tinggi Tanaman :
Minggu pertama: Tinggi sawi bisa mencapai ±3.4 cm.
Minggu kedua: Tinggi sawi bisa mencapai ±5.5 cm.
Minggu ketiga: Tinggi sawi bisa mencapai ±9.4 cm.
Minggu keempat: Tinggi sawi bisa mencapai ±14.2 cm.

Informasi Jumlah Daun :
Minggu pertama: Jumlah daun sekitar 2–3 helai.
Minggu kedua: Jumlah daun sekitar 3–5 helai.
Minggu ketiga: Jumlah daun sekitar 5–6 helai.
Minggu keempat: Jumlah daun sekitar 6–7 helai.

Ciri Daun Sehat :
Minggu pertama: Warna hijau segar, tidak layu, pertumbuhan simetris.
Minggu kedua: Daun mulai melebar, tidak ada bercak, bertekstur halus.
Minggu ketiga: Daun lebar, hijau gelap, tegak.
Minggu keempat: Daun sehat, tidak ada tanda penyakit, pertumbuhan konsisten.

Suhu (°C) :
Setiap minggu: Suhu ideal berkisar antara 28–32°C.

Sinar Matahari (jam/hari) :
Minggu pertama hingga kedua: 4–6 jam/hari.
Minggu ketiga hingga keempat: 5–6 jam/hari.

Frekuensi Penyiraman :
Minggu pertama: 2x sehari (pagi & sore), ±200 ml.
Minggu kedua: 2x sehari (pagi & sore), ±250 ml.
Minggu ketiga: 2x sehari, ±300 ml.
Minggu keempat: 2x sehari, ±350 ml.

Bobot Segar (gram) :
Minggu keempat: Bobot segar sawi mencapai ±10.4 gram.


[Dataset Pertumbuhan Sawi yang Tidak Sehat]

Informasi Tinggi Tanaman :
Minggu pertama: Tinggi sawi hanya 1.5–2.5 cm.
Minggu kedua: Tinggi sawi hanya 3.5–4.5 cm.
Minggu ketiga: Tinggi sawi hanya 6–7.5 cm.
Minggu keempat: Tinggi sawi hanya 9–11.5 cm.

Informasi Jumlah Daun :
Minggu pertama: Hanya 1–2 helai daun.
Minggu kedua: 2–3 helai daun.
Minggu ketiga: 4–5 helai daun.
Minggu keempat: 5–6 helai daun.

Ciri Daun Tidak Sehat :
Minggu pertama: Ukuran daun kecil, warna pucat, ujung daun kering.
Minggu kedua: Daun keriput, ada bercak, warna tidak merata.
Minggu ketiga: Daun menggulung, lemas, batang lemah.
Minggu keempat: Daun kusam, bagian bawah kering.

Suhu (°C) :
Minggu pertama hingga kedua: Suhu >32°C.
Minggu ketiga: Suhu fluktuatif.
Minggu keempat: Suhu >34°C atau <26°C.

Sinar Matahari (jam/hari) :
Minggu pertama hingga kedua: <4 jam/hari.
Minggu ketiga: Tidak stabil.
Minggu keempat: <4 jam/hari.

Frekuensi Penyiraman :
Minggu pertama: <1x sehari, <200 ml.
Minggu kedua: Terlalu sering atau sedikit.
Minggu ketiga: Tidak konsisten.
Minggu keempat: Berlebihan atau terlalu jarang.

Bobot Segar (gram) :
Minggu keempat: Bobot segar hanya 5–7 gram.
`;

type GrowthReportParams = {
  userId: string;
  plantId: string;
  photo: File;
  plantingDate: number; // Timestamp in milliseconds

  plantHeight: string | undefined;
  leafCount: string | undefined;
  freshWeight: string | undefined;
  leafCondition: string | undefined;
  temperature: string | undefined;
  plantSymptoms: string | undefined;
  sunlight: string | undefined;
  waterFrequency: string | undefined;
};
export async function submitGrowthReportAction(data: GrowthReportParams) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);
  const storage = getStorage(firebaseServerApp);

  try {
    let imageUrl: string | null = null;
    if (data.photo) {
      try {
        // Get file extension from original filename
        const fileExt = data.photo.name.split(".").pop();
        const consistentName = `report-image.${fileExt}`;

        // Delete previous image if exists
        const oldImageRef = ref(storage, `plants/${data.userId}/${data.plantId}/${consistentName}`);

        try {
          await deleteObject(oldImageRef);
          console.log("Deleted previous report image");
        } catch (error) {
          console.log("No previous image to delete");
        }

        // Upload new image
        const storageRef = ref(storage, `plants/${data.userId}/${data.plantId}/${consistentName}`);

        const snapshot = await uploadBytes(storageRef, data.photo);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error handling report image:", error);
        // Handle error but continue with the report
      }
    }

    // Defining which week it is based on the planting date
    const reportDate = new Date();
    const diffInMs = reportDate.getTime() - data.plantingDate;
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1; // Tambahkan 1 untuk menghitung minggu pertama

    const userInput = `
        [Tinggi Tanaman]
        Berapa tinggi tanaman dari pangkal batang hingga ujung daun tertinggi? ${data.plantHeight} cm
        [Jumlah Daun]
        Berapa jumlah daun sejati? ${data.leafCount} helai
        [Kondisi Daun]
        Bagaimana kondisi daun tanaman? ${data.leafCondition}
        [Suhu Lingkungan]
        Berapa suhu lingkungan tanaman? ${data.temperature} °C
        [Gejala Tanaman]
        Apakah ada gejala yang terlihat pada tanaman? ${data.plantSymptoms}
        [Sinar Matahari]
        Berapa lama tanaman terkena sinar matahari per hari? ${data.sunlight} jam
        [Frekuensi Penyiraman]
        Berapa kali Anda menyiram tanaman dalam seminggu? ${data.waterFrequency} kali
        [Bobot Segar]
        Berapa bobot segar tanaman? ${data.freshWeight} gram
    `;

    const geminiResult: { analysis: string | null; totalToken: number } = {
      analysis: "",
      totalToken: 0,
    };
    if (imageUrl) {
      try {
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
                  ANALISIS TANAMAN SAWI
                  [Aturan Analisis]
                  1. Walaupun terdapat Data Referensi dan Input Pengguna, tetaplah fokus pada analisis gambar yang diberikan, data yang diberikan hanyalah pendukung.
                  2. Gunakan dataset minggu ke-${diffInWeeks} untuk analisis.
                  3. Jika Input Pengguna tidak sesuai dengan Data Referensi, tetaplah fokus pada analisis gambar yang diberikan.
                  4. Jika Input Pengguna kosong, abaikan dan fokus pada analisis gambar yang diberikan.
                  
                  [Data Referensi]
                  ${dataset}
                  
                  [Input Pengguna]
                  ${userInput}
                  
                  [Format Output Wajib]
                  <GRADE>
                  [Skala A (sangat baik) sampai F (sangat buruk)]
                  </GRADE>

                  <CATATAN_TAMBAHAN>
                  1. Analisis kondisi tanaman berdasarkan data
                  2. Identifikasi masalah utama (jika ada)
                  3. Solusi spesifik yang direkomendasikan
                  </CATATAN_TAMBAHAN>

                  <AKSI_REKOMENDASI>
                  1. Langkah konkret pertama yang harus dilakukan
                  2. Langkah monitoring
                  3. Tindakan lanjutan jika diperlukan
                  </AKSI_REKOMENDASI>

                  [Aturan Response]
                  1. Gunakan format XML-like di atas secara ketat
                  2. Setiap bagian harus diapit oleh tag pembuka dan penutup
                  3. Gunakan bullet points untuk poin-poin penting
                  4. Jangan tambahkan teks penjelasan di luar format yang diminta
                  `,
                },
                {
                  inlineData: {
                    data: Buffer.from(await data.photo.arrayBuffer()).toString("base64"),
                    mimeType: data.photo.type,
                  },
                },
              ],
            },
          ],
        });

        geminiResult.analysis = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        geminiResult.totalToken = result.response.usageMetadata?.totalTokenCount || 0;
        console.log("Used token: ", geminiResult.totalToken);
      } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        geminiResult.analysis = "Gagal menganalisis gambar dengan AI.";
      }
    } else {
      geminiResult.analysis = "Tidak ada foto untuk dianalisis.";
    }

    // Parse the response to extract the parts
    const extractParts = (text: string | null) => {
      if (!text) return { grade: "", additionalNotes: "", recommendedActions: "" };

      const gradeMatch = text.match(/<GRADE>([\s\S]*?)<\/GRADE>/);
      const notesMatch = text.match(/<CATATAN_TAMBAHAN>([\s\S]*?)<\/CATATAN_TAMBAHAN>/);
      const actionsMatch = text.match(/<AKSI_REKOMENDASI>([\s\S]*?)<\/AKSI_REKOMENDASI>/);

      return {
        grade: gradeMatch?.[1]?.trim() || "",
        additionalNotes: notesMatch?.[1]?.trim() || "",
        recommendedActions: actionsMatch?.[1]?.trim() || "",
      };
    };
    const { grade, additionalNotes, recommendedActions } = extractParts(geminiResult.analysis);

    // Todo: Enable this if you want to save the report to Firestore
    // await addDoc(collection(db, `users/${data.userId}/plants/${data.plantId}/growthReports`), {
    //   imageUrl: imageUrl,
    //   conditionRate: grade,
    //   additionalNotes: additionalNotes,
    //   recommendedActions: recommendedActions,
    //   date: serverTimestamp(),
    // });

    // Update plant document with latest conditionRate, additionalNotes, recommendedActions
    // Todo: Enable this if you just want to update the plant document
    const plantRef = doc(db, `users/${data.userId}/plants/${data.plantId}`);
    await updateDoc(plantRef, {
      conditionRate: grade,
      additionalNotes: additionalNotes,
      recommendedActions: recommendedActions,
      lastGrowthReportDate: Timestamp.now(),
      lastGrowthReportImageUrl: imageUrl,
    });

    revalidatePath(`/dashboard`);
    revalidatePath(`/plants/${data.plantId}`);
    return {
      success: true,
      message: "Laporan pertumbuhan berhasil dikirim.",
      variant: "default",
      data: {
        grade,
        additionalNotes,
        recommendedActions,
        imageUrl,
      },
    };
  } catch (error: any) {
    console.error("Error submitting growth report:", error);
    return {
      success: false,
      error: error.message || "Terjadi kesalahan saat menyimpan laporan.",
      variant: "destructive",
    };
  }
}
