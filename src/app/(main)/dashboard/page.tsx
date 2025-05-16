"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebase/client";
import { getPlants, getPlantsSnapshot } from "@/lib/firebase/firestore";
import { useUser } from "@/lib/firebase/getUser";
import { Plant } from "@/types";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";

// export const dynamic = "force-dynamic";

export default function Page() {
  const user = useUser();
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchPlants = async () => {
      if (user) {
        const data = await getPlants(db, user.uid);
        setPlants(data);
      }
    };
    fetchPlants();
  }, [user?.uid]);

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Bagian atas dengan background hijau dan lengkungan bawah */}
      <div className='bg-[#328E6E] p-4 rounded-b-xl relative overflow-hidden'>
        {!plants ||
          (plants.length === 0 && (
            <div className='absolute inset-0 z-10 flex items-center justify-center'>
              <div className='absolute inset-0 bg-black bg-opacity-50'></div>
              <div className='relative w-[35%] max-w-md h-[30px] bg-[#328E6E] rounded-xl flex items-center justify-center'>
                <p className='text-white text-sm'>No plants found yet!</p>
              </div>
            </div>
          ))}

        {/* Header */}
        <div className='bg-[#72CDAE] text-white p-4 rounded-xl shadow-md'>
          <div className='flex justify-between items-center'>
            <p className='text-sm'>Watering Streak!</p>
            <div className='text-sm'>2025</div>
          </div>
        </div>

        {/* Kalender */}
        <Card className='mt-2 rounded-lg shadow bg-[#72CDAE] text-white border-none px-2 py-1'>
          <CardContent className='flex justify-center p-0'>
            <Suspense>
              <Calendar
                mode='single'
                selected={new Date()}
                className='
                                    bg-transparent text-white text-xs
                                    [&_.rdp-day_selected]:bg-[#45C0FF]
                                    [&_.rdp-day_selected]:text-white
                                    [&_.rdp-day_today]:border-none
                                    [&_.rdp-day]:border-none
                                    [&_.rdp]:border-none
                                '
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {!plants || plants.length > 0 ? (
        <>
          {/* Your Plants */}
          <div className='px-6 py-6 space-y-2 bg-white'>
            <p className='text-md font-semibold'>Your Plants!</p>
            {plants.map((plant, i) => (
              <div key={i} className='flex items-center p-2 rounded-lg shadow-sm bg-white'>
                <Image
                  src={plant.imageUrl || "/assets/images/sawi1.png"}
                  alt='Sawi Plant'
                  width={50}
                  height={50}
                  className='rounded-lg'
                />
                <div className='ml-3 flex-1'>
                  <p className='font-medium text-sm'>{plant.name}</p>
                </div>
                <Button asChild size='sm' className='bg-[#328E6E] hover:bg-[#5bb395] text-white'>
                  <a href={`/plants/${plant.id}`}>Check</a>
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className='flex flex-col items-center w-full py-4'>
            <Image src='/assets/images/logo2.png' alt='Logo' width={88} height={88} />
            <span className='text-gray-400 text-base text-center mt-2'>
              You haven’t planted anything yet :(
            </span>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <div className='fixed bottom-0 left-0 right-0 bg-white shadow-inner flex justify-around py-3'>
        <div className='flex flex-col items-center text-green-600'>
          {/* Placeholder for icons */}
        </div>
      </div>
    </div>
  );
}
