// src/types/index.ts
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  onboardingCompleted?: boolean;
}

export interface Plant {
  id: string;
  userId: string;
  name: string;
  species: string; // e.g., "Sawi Hijau"
  datePlanted: Timestamp;
  lastReportDate?: Timestamp;
  photoURL?: string; // Main photo of the plant
  notes?: string;
}

export interface GrowthReport {
  id: string;
  plantId: string;
  userId: string;
  reportDate: Timestamp;
  photoURL?: string; // Photo for this specific report
  question?: string;
  advice?: string; // AI generated advice
  notes?: string; // User notes for this report
  height?: number; // in cm
  leafCount?: number;
}

export interface WateringLog {
  id: string;
  plantId: string;
  userId: string;
  wateredDate: Timestamp;
  amount?: number; // in ml or other unit
  notes?: string;
}
