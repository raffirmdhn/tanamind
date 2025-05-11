// src/app/(main)/dashboard/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, CalendarDays, PlusCircle, Sprout, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Plant } from "@/types"; // Assuming plant type will be defined
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';


export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [streak, setStreak] = useState(0); // Placeholder for streak logic

  useEffect(() => {
    if (!user) return;

    setLoadingPlants(true);
    const plantsRef = collection(db, `users/${user.uid}/plants`);
    const q = query(plantsRef, orderBy("datePlanted", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plantsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
      setPlants(plantsData);
      setLoadingPlants(false);
      // TODO: Calculate streak based on growth reports
    }, (error) => {
      console.error("Error fetching plants:", error);
      setLoadingPlants(false);
    });

    return () => unsubscribe();
  }, [user]);


  if (!userProfile && !user) {
    return <div className="text-center p-4">Memuat dasbor...</div>;
  }

  const displayName = userProfile?.displayName || user?.displayName || "Pengguna";

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary to-green-600 text-primary-foreground shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Selamat Datang, {displayName}!</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Siap untuk melihat perkembangan tanaman Sawi Hijau Anda hari ini?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            <div>
              <p className="text-2xl font-bold">{streak} Hari</p>
              <p className="text-sm text-primary-foreground/90">Streak Laporan</p>
            </div>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/report">
              Lapor Sekarang <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Tanaman Anda</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/plants/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Tanaman
          </Link>
        </Button>
      </div>

      {loadingPlants && <p className="text-muted-foreground">Memuat daftar tanaman...</p>}
      
      {!loadingPlants && plants.length === 0 && (
        <Card className="text-center">
          <CardHeader>
            <Sprout className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Belum Ada Tanaman</CardTitle>
            <CardDescription>
              Tambahkan tanaman Sawi Hijau pertama Anda untuk memulai.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/plants/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Tanaman Baru
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!loadingPlants && plants.length > 0 && (
        <div className="space-y-4">
          {plants.map((plant) => (
            <Link href={`/plants/${plant.id}`} key={plant.id} legacyBehavior>
              <a className="block hover:no-underline">
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3 h-32 relative">
                       <Image
                        src={plant.photoURL || "https://picsum.photos/200/300?random=" + plant.id}
                        alt={plant.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="green plant"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <CardTitle className="text-lg mb-1 truncate">{plant.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                        <Sprout className="h-4 w-4 text-green-500" />
                        {plant.species || "Sawi Hijau"}
                      </CardDescription>
                       <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        Ditanam: {plant.datePlanted ? format(plant.datePlanted.toDate(), 'dd MMM yyyy', { locale: id }) : 'N/A'}
                      </CardDescription>
                      {plant.lastReportDate && (
                         <CardDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <FileText className="h-3 w-3" />
                            Laporan terakhir: {format(plant.lastReportDate.toDate(), 'dd MMM yyyy', { locale: id })}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
