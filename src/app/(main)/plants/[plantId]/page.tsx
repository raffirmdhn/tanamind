// src/app/(main)/plants/[plantId]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/context/AuthContext';
import type { Plant, GrowthReport, WateringLog } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft, CalendarDays, Sprout, FileText, Droplets, PlusCircle, Edit3, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as dateLocaleId } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePlantAndSubcollections } from '@/lib/firebase/firestore'; // To be created
import { useToast } from '@/hooks/use-toast';

export default function PlantDetailPage() {
  const params = useParams();
  const plantId = params.plantId as string;
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [growthReports, setGrowthReports] = useState<GrowthReport[]>([]);
  const [wateringLogs, setWateringLogs] = useState<WateringLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !plantId) return;

    setLoading(true);
    // Fetch plant details
    const plantDocRef = doc(db, `users/${user.uid}/plants/${plantId}`);
    const unsubPlant = onSnapshot(plantDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setPlant({ id: docSnap.id, ...docSnap.data() } as Plant);
      } else {
        toast({ title: "Error", description: "Tanaman tidak ditemukan.", variant: "destructive" });
        router.push('/dashboard');
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching plant details:", error);
        toast({ title: "Error", description: "Gagal memuat detail tanaman.", variant: "destructive" });
        setLoading(false);
    });

    // Fetch growth reports
    const reportsRef = collection(db, `users/${user.uid}/plants/${plantId}/growth_reports`);
    const reportsQuery = query(reportsRef, orderBy("reportDate", "desc"));
    const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
      setGrowthReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GrowthReport)));
    });

    // Fetch watering logs
    const logsRef = collection(db, `users/${user.uid}/plants/${plantId}/watering_logs`);
    const logsQuery = query(logsRef, orderBy("wateredDate", "desc"));
    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
      setWateringLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WateringLog)));
    });
    
    return () => {
      unsubPlant();
      unsubReports();
      unsubLogs();
    };
  }, [user, plantId, router, toast]);

  const handleDeletePlant = async () => {
    if (!user || !plant) return;
    try {
      await deletePlantAndSubcollections(user.uid, plant.id);
      toast({ title: "Tanaman Dihapus", description: `${plant.name} berhasil dihapus.` });
      router.push('/dashboard');
    } catch (error) {
      console.error("Error deleting plant:", error);
      toast({ title: "Gagal Menghapus", description: "Tidak dapat menghapus tanaman.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Memuat detail tanaman...</span></div>;
  }

  if (!plant) {
    return <div className="text-center p-4">Tanaman tidak ditemukan.</div>;
  }

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd MMM yyyy, HH:mm', { locale: dateLocaleId });
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="p-0 relative">
           <Button variant="ghost" size="icon" onClick={() => router.back()} className="absolute top-3 left-3 z-10 bg-background/70 hover:bg-background/90 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {plant.photoURL && (
            <div className="w-full h-60 relative">
              <Image src={plant.photoURL} alt={plant.name} layout="fill" objectFit="cover" data-ai-hint="plant" />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-1">{plant.name}</CardTitle>
              <CardDescription className="text-md text-muted-foreground flex items-center gap-1 mb-1">
                <Sprout className="h-5 w-5 text-green-500" />
                {plant.species}
              </CardDescription>
              <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                Ditanam: {plant.datePlanted ? format(plant.datePlanted.toDate(), 'dd MMMM yyyy', { locale: dateLocaleId }) : 'N/A'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {/* <Button variant="outline" size="icon" disabled> <Edit3 className="h-4 w-4" /> */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon"> <Trash2 className="h-4 w-4" /> </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan menghapus tanaman "{plant.name}" beserta semua laporan dan log penyiramannya. Data tidak dapat dipulihkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletePlant} className="bg-destructive hover:bg-destructive/90">Hapus</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {plant.notes && <p className="mt-3 text-sm text-foreground bg-muted/50 p-3 rounded-md">{plant.notes}</p>}
        </CardContent>
         <CardFooter className="flex gap-2 p-4 border-t">
            <Button asChild className="flex-1">
              <Link href={`/report?plantId=${plant.id}`}>
                <PlusCircle className="mr-2 h-4 w-4" /> Lapor Pertumbuhan
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" disabled> {/* Placeholder for watering log */}
              <Droplets className="mr-2 h-4 w-4" /> Catat Penyiraman
            </Button>
          </CardFooter>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Laporan Pertumbuhan</h3>
        {growthReports.length === 0 ? (
          <p className="text-muted-foreground">Belum ada laporan pertumbuhan.</p>
        ) : (
          <div className="space-y-3">
            {growthReports.map(report => (
              <Card key={report.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Laporan {formatDate(report.reportDate)}</CardTitle>
                  {report.photoURL && (
                     <div className="w-full h-40 relative rounded-md overflow-hidden my-2">
                        <Image src={report.photoURL} alt={`Laporan ${report.id}`} layout="fill" objectFit="cover" data-ai-hint="plant growth stage" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  {report.question && <p><strong>Pertanyaan:</strong> {report.question}</p>}
                  {report.advice && <p><strong>Saran AI:</strong> {report.advice}</p>}
                  {report.notes && <p><strong>Catatan:</strong> {report.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Droplets className="h-5 w-5 text-blue-500" /> Log Penyiraman</h3>
        {wateringLogs.length === 0 ? (
          <p className="text-muted-foreground">Belum ada log penyiraman.</p>
        ) : (
          <div className="space-y-3">
            {wateringLogs.map(log => (
              <Card key={log.id}>
                <CardContent className="p-3 text-sm">
                  <p>Disiram pada: {formatDate(log.wateredDate)}</p>
                  {log.amount && <p>Jumlah: {log.amount} ml</p>}
                  {log.notes && <p>Catatan: {log.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
