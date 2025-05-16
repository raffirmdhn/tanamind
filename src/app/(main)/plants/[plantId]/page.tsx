// src/app/(main)/plants/[plantId]/page.tsx
"use client";

import { deletePlant, wateringPlant } from "@/actions/plantAction";
import AnalyzedResult from "@/components/PlantReport/AnalyzedResult";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePlantData } from "@/hooks/usePlantData";
import { formatWateringDate } from "@/lib/date-fns";
import { format } from "date-fns";
import { Calendar, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PlantDetailPage() {
  const params = useParams();
  const plantId = params.plantId as string;
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch plant data
  const { growthReports, loading, plant, wateringLogs } = usePlantData(user?.uid, plantId);

  const handleDeletePlant = async () => {
    if (!user || !plant) return;

    if (!confirm("Apakah Anda yakin ingin menghapus tanaman ini?")) {
      toast({
        title: "Penghapusan Dibatalkan",
        description: "Tanaman tidak dihapus.",
        variant: "default",
      });
      return;
    }

    const result = await deletePlant({
      userId: user.uid,
      plantId: plant.id,
    });
    toast({
      title: result.message,
      description: result.description,
      // @ts-expect-error
      variant: result.variant,
    });
    if (result.success) {
      router.push("/dashboard");
    }
  };

  const [isHandlingWaterPlant, setIsHandlingWaterPlant] = useState(false);

  const handleWaterPlant = async () => {
    if (
      plant &&
      plant.lastWateringDate &&
      format(plant.lastWateringDate.toDate(), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
    ) {
      toast({
        title: "Tanaman Sudah Disiram",
        description: `${plant.name} sudah disiram hari ini.`,
        variant: "default",
      });
      return;
    }

    if (!user || !plant) return;
    setIsHandlingWaterPlant(true);

    const result = await wateringPlant({ plantId: plant.id, userId: user.uid });
    toast({
      title: result.message,
      description: result.description,
      // @ts-expect-error
      variant: result.variant,
    });
    setIsHandlingWaterPlant(false);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />{" "}
        <span className='ml-2'>Memuat detail tanaman...</span>
      </div>
    );
  }

  if (!plant) {
    return <div className='text-center p-4'>Tanaman tidak ditemukan.</div>;
  }

  const isWateredToday =
    !!plant.lastWateringDate &&
    format(plant.lastWateringDate.toDate(), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const isGrowthReportToday =
    !!plant.lastGrowthReportDate &&
    format(plant.lastGrowthReportDate.toDate(), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className='flex flex-col justify-between flex-grow bg-white items-center px-4 pt-6 pb-[40px] min-h-full'>
      {/* Header */}
      <div className='w-full max-w-sm flex items-center justify-between px-2 mb-[40px]'>
        <Link href='/dashboard'>
          <span className='text-[#328e6e] text-2xl font-bold cursor-pointer'>&lt;</span>
        </Link>
        <h2 className='text-base font-medium text-gray-800'>{plant.name}</h2>
        <div className='w-5 h-5' />
      </div>

      {/* Gambar Tanaman */}
      <div className='w-full max-w-sm rounded-2xl overflow-hidden mb-[40px]'>
        <Image
          src={plant.lastGrowthReportImageUrl || plant.imageUrl || "/assets/images/sawi1.png"}
          alt='Sawi Plant'
          width={340}
          height={200}
          className='w-full h-[170px] object-cover rounded-2xl'
        />
      </div>

      {/* Informasi Penyiraman & Penanaman */}
      <div className='w-full max-w-sm flex justify-between items-center mb-4'>
        <div className='w-[158px] h-[60px] border border-[#328e6e] rounded-xl flex items-center px-3'>
          <Clock className='w-4 h-4 text-[#328e6e] mr-2' />
          <div>
            <p className='text-[11px] text-gray-500'>Last watered</p>
            <p className='text-xs font-medium text-gray-800 capitalize'>
              {plant.lastWateringDate
                ? formatWateringDate(plant.lastWateringDate.toDate())
                : "Never watered yet"}
            </p>
          </div>
        </div>
        <div className='w-[158px] h-[60px] border border-[#328e6e] rounded-xl flex items-center px-3'>
          <Calendar className='w-4 h-4 text-[#328e6e] mr-2' />
          <div>
            <p className='text-[11px] text-gray-500'>Last reported</p>
            <p className='text-xs font-medium text-gray-800 capitalize'>
              {plant.lastGrowthReportDate
                ? formatWateringDate(plant.lastGrowthReportDate.toDate())
                : "Never reported yet"}
            </p>
          </div>
        </div>
      </div>

      <div className='w-full h-[60px] border border-[#328e6e] rounded-xl flex items-center px-3 mb-3'>
        <Calendar className='w-4 h-4 text-[#328e6e] mr-2' />
        <div>
          <p className='text-[11px] text-gray-500'>Planted on</p>
          <p className='text-sm font-medium text-gray-800'>
            {plant.plantingDate
              ? format(plant.plantingDate.toDate(), "dd MMM yyyy")
              : "Tanggal tidak tersedia"}
          </p>
        </div>
      </div>

      {/* Kondisi Tanaman */}
      {!!plant.conditionRate && (
        <AnalyzedResult
          analyzedReport={{
            grade: plant.conditionRate,
            additionalNotes: plant.additionalNotes ?? "",
            recommendedActions: plant.recommendedActions ?? "",
          }}
        />
      )}

      {/* Tombol Aksi */}
      <div className='w-full max-w-sm flex flex-col gap-3 mt-auto'>
        <Button
          onClick={handleWaterPlant}
          disabled={isHandlingWaterPlant || isWateredToday}
          variant='outline'
          className='w-full border border-[#328e6e] text-[#328e6e] hover:bg-[#e3f6f1] font-medium text-sm rounded-xl h-10'>
          Water Plant 🪣
        </Button>

        <Button
          disabled={isGrowthReportToday}
          className='w-full bg-[#328e6e] hover:bg-[#28765c] text-white font-medium text-sm rounded-xl h-10'>
          <Link
            onClick={e => isGrowthReportToday && e.preventDefault()}
            href={`/plants/${plantId}/report`}>
            Report Growth Plant 📈
          </Link>
        </Button>

        <Button
          onClick={handleDeletePlant}
          variant='outline'
          className='w-full border border-[#f44336] text-[#f44336] hover:bg-[#fdeaea] font-medium text-sm rounded-xl h-10'>
          Delete Plant ❌
        </Button>
      </div>
    </div>
  );
}
