// hooks/usePlantData.ts
import { useEffect, useState } from "react";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/client"; // sesuaikan dengan project kamu
import { GrowthReport, Plant, WateringLog } from "@/types";
import { useToast } from "./use-toast";

export function usePlantData(userId: string | undefined, plantId: string) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [growthReports, setGrowthReports] = useState<GrowthReport[]>([]);
  const [wateringLogs, setWateringLogs] = useState<WateringLog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId || !plantId) return;

    setLoading(true);
    const plantDocRef = doc(db, `users/${userId}/plants/${plantId}`);
    const unsubPlant = onSnapshot(
      plantDocRef,
      docSnap => {
        if (docSnap.exists()) {
          setPlant({ id: docSnap.id, ...docSnap.data() } as Plant);
        } else {
          toast({
            title: "Error",
            description: "Tanaman tidak ditemukan.",
            variant: "destructive",
          });
          router.push("/dashboard");
        }
        setLoading(false);
      },
      error => {
        console.error("Error fetching plant:", error);
        toast({
          title: "Error",
          description: "Gagal memuat detail tanaman.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    const reportsRef = collection(db, `users/${userId}/plants/${plantId}/growthReports`);
    const reportsQuery = query(reportsRef, orderBy("date", "desc"));
    const unsubReports = onSnapshot(reportsQuery, snapshot => {
      setGrowthReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GrowthReport)));
    });

    const logsRef = collection(db, `users/${userId}/plants/${plantId}/wateringLogs`);
    const logsQuery = query(logsRef, orderBy("date", "desc"));
    const unsubLogs = onSnapshot(logsQuery, snapshot => {
      setWateringLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WateringLog)));
    });

    return () => {
      unsubPlant();
      unsubReports();
      unsubLogs();
    };
  }, [userId, plantId]);

  return { plant, growthReports, wateringLogs, loading };
}
