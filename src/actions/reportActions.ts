// src/actions/reportActions.ts
"use server";

import { generateGrowthAdvice } from '@/ai/flows/generate-growth-advice';
import { db, storage } from '@/lib/firebase/client'; // Using client for server actions is fine for this scope
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import type { GrowthReport } from '@/types';

interface SubmitReportResult {
  success: boolean;
  advice?: string;
  reportId?: string;
  error?: string;
}

// Helper function to convert File to Data URI
async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}


export async function submitGrowthReportAction(formData: FormData): Promise<SubmitReportResult> {
  const plantId = formData.get('plantId') as string;
  const question = formData.get('question') as string;
  const photoFile = formData.get('photo') as File;
  const includeSpecificInfo = formData.get('includeSpecificInfo') === 'true';
  const notes = formData.get('notes') as string | undefined;
  const userId = formData.get('userId') as string;

  if (!userId || !plantId || !question || !photoFile) {
    return { success: false, error: "Data tidak lengkap." };
  }

  try {
    // 1. Upload photo to Firebase Storage
    const photoName = `${Date.now()}_${photoFile.name}`;
    const photoRef = ref(storage, `users/${userId}/plants/${plantId}/reports/${photoName}`);
    const uploadResult = await uploadBytes(photoRef, photoFile);
    const photoURL = await getDownloadURL(uploadResult.ref);

    // 2. Convert photo to data URI for GenAI
    const photoDataUri = await fileToDataUri(photoFile);

    // 3. Call GenAI flow
    const aiInput = {
      photoDataUri,
      question,
      includeSpecificInfo,
    };
    const aiOutput = await generateGrowthAdvice(aiInput);
    const advice = aiOutput.advice;

    // 4. Save report to Firestore
    const reportData: Omit<GrowthReport, 'id'> = {
      plantId,
      userId,
      reportDate: serverTimestamp(),
      photoURL,
      question,
      advice,
      notes: notes || '',
    };

    const reportRef = await addDoc(collection(db, `users/${userId}/plants/${plantId}/growth_reports`), reportData);
    
    // 5. Update lastReportDate on the plant document
    const plantDocRef = doc(db, `users/${userId}/plants/${plantId}`);
    await updateDoc(plantDocRef, {
      lastReportDate: serverTimestamp()
    });


    return { success: true, advice, reportId: reportRef.id };

  } catch (error: any) {
    console.error("Error submitting report:", error);
    // Check if error is from Genkit or Firebase
    let errorMessage = "Gagal memproses laporan. ";
    if (error.message.includes('API key not valid')) {
        errorMessage += "Kunci API Gemini tidak valid atau hilang. Harap periksa konfigurasi .env.local Anda.";
    } else if (error.message) {
        errorMessage += error.message;
    } else {
        errorMessage += "Terjadi kesalahan tidak diketahui.";
    }
    return { success: false, error: errorMessage };
  }
}
