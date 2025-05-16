import { ReportFormValues } from "@/app/(main)/plants/[plantId]/report/page";

export const reportQuestion: {
  key: keyof ReportFormValues;
  type: "text" | "number";
  question: string;
  placeholder: string;
  description: string;
  week: number[];
}[] = [
  {
    key: "plantHeight",
    type: "number",
    question: "Berapa tinggi tanaman sawi Anda minggu ini (cm)?",
    placeholder: "Tinggi tanaman (cm)",
    description: "Tinggi tanaman dari pangkal batang hingga ujung daun tertinggi.",
    week: [1, 2, 3, 4],
  },
  {
    key: "leafCount",
    type: "number",
    question: "Berapa jumlah daun tanaman sawi Anda minggu ini?",
    placeholder: "Jumlah daun",
    description: "Jumlah daun sejati yang sudah terbentuk.",
    week: [1, 2, 3, 4],
  },
  {
    key: "leafCondition",
    type: "text",
    question: "Bagaimana kondisi daun tanaman sawi Anda minggu ini?",
    placeholder: "cth: hijau, kuning, keriting, bolong, kotor",
    description: "Kondisi daun tanaman sawi Anda minggu ini.",
    week: [1, 2, 3, 4],
  },
  {
    key: "temperature",
    type: "number",
    question: "Berapa suhu lingkungan tanaman sawi Anda minggu ini (°C)?",
    placeholder: "Suhu lingkungan (°C)",
    description: "Suhu rata-rata lokasi tanam.",
    week: [1, 2, 3, 4],
  },
  {
    key: "sunlight",
    type: "number",
    question: "Berapa lama tanaman terkena sinar matahari per hari (jam)?",
    placeholder: "Lama sinar matahari (jam)",
    description: "Lama waktu tanaman terkena sinar matahari per hari.",
    week: [1, 2, 3, 4],
  },
  {
    key: "waterFrequency",
    type: "number",
    question: "Berapa kali Anda menyiram tanaman sawi Anda dalam seminggu?",
    placeholder: "Frekuensi penyiraman (kali)",
    description: "Frekuensi penyiraman tanaman sawi Anda dalam seminggu.",
    week: [1, 2, 3],
  },
  {
    key: "plantSymptoms",
    type: "text",
    question: "Apakah tanaman menunjukkan gejala sakit?",
    placeholder: "cth: daun kuning, bercak hitam, layu",
    description: "Gejala yang muncul pada tanaman sawi Anda.",
    week: [4],
  },
  {
    key: "freshWeight",
    type: "number",
    question: "Berapa bobot segar tanaman sawi Anda minggu ini (gram)?",
    placeholder: "Bobot segar (gram)",
    description: "Bobot segar tanaman sawi Anda minggu ini.",
    week: [4],
  },
];
