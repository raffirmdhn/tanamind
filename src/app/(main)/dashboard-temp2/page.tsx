import { 
    Card,
    CardContent,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="min-h-screen bg-white flex flex-col relative">
            {/* Kotak kecil dengan warna #328E6E di tengah */}
            {/* Kotak kecil dengan warna #328E6E di tengah */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[35%] max-w-md h-[30px] bg-[#328E6E] rounded-xl z-50 flex items-center justify-center">
                <p className="text-white text-sm">No plants found yet!</p>
            </div>

            {/* Kotak transparan hitam sedikit naik menutupi header dan kalender */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-[98%] max-w-md h-[380px] bg-black/40 rounded-xl z-40 pointer-events-none" />

            {/* Bagian atas dengan background hijau dan lengkungan bawah */}
            <div className="bg-[#328E6E] p-4 rounded-b-3xl">
                {/* Header */}
                <div className="bg-[#72CDAE] text-white p-4 rounded-xl shadow-md relative z-10">
                    <div className="flex justify-between items-center">
                        <div className="text-sm">2025 ▾</div>
                    </div>
                    <p className="text-sm mt-1">Watering Calender</p>
                </div>

                {/* Kalender */}
                <Card className="mt-2 rounded-lg shadow bg-[#72CDAE] text-white border-none px-2 py-1 relative z-10">
                    <CardContent className="flex justify-center p-0">
                        <Suspense>
                            <Calendar
                                mode="single"
                                selected={new Date()}
                                disabled
                                className="bg-transparent text-white text-xs
                                    [&_.rdp-day_selected]:bg-[#45C0FF]
                                    [&_.rdp-day_selected]:text-white
                                    [&_.rdp-day_today]:border-none
                                    [&_.rdp-day]:border-none
                                    [&_.rdp]:border-none
                                    pointer-events-none
                                "
                            />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>

            {/* Gambar Logo */}
            <div className="flex justify-center w-full py-4">
                <Image
                    src="/assets/images/logo2.jpeg"
                    alt="Logo"
                    width={66}
                    height={66}
                    className="rounded-lg shadow-md ml-2"
                />
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner flex justify-around py-3">
                <div className="flex flex-col items-center text-green-600">
                    {/* Placeholder for icons */}
                </div>
            </div>
        </div>
    );
}
