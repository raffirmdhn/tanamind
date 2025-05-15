import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Bagian atas dengan background hijau dan lengkungan bawah */}
      <div className='bg-[#328E6E] p-4 rounded-b-3xl'>
        {/* Header */}
        <div className='bg-[#72CDAE] text-white p-4 rounded-xl shadow-md'>
          <div className='flex justify-between items-center'>
            <div className='text-sm'>2025 ▾</div>
          </div>
          <p className='text-sm mt-1'>Watering Streak!</p>
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

      {/* Your Plants */}
      <div className='px-6 py-6 space-y-2 bg-white'>
        <p className='text-md font-semibold'>Your Plants!</p>
        {[1, 2].map(item => (
          <div key={item} className='flex items-center p-2 rounded-lg shadow-sm bg-white'>
            <Image
              src='/assets/images/sawi1.png'
              alt='Sawi Plant'
              width={50}
              height={50}
              className='rounded-lg'
            />
            <div className='ml-3 flex-1'>
              <p className='font-medium text-sm'>Sawi Plant</p>
            </div>
            <Button size='sm' className='bg-[#328E6E] hover:bg-[#5bb395] text-white'>
              Check
            </Button>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className='fixed bottom-0 left-0 right-0 bg-white shadow-inner flex justify-around py-3'>
        <div className='flex flex-col items-center text-green-600'>
          {/* Placeholder for icons */}
        </div>
      </div>
    </div>
  );
}
