import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center w-full max-w-[393px] mx-auto overflow-hidden">
            {/* Bagian atas dengan background gradasi hijau dan sudut membulat */}
            <div className="w-full flex flex-col items-center mt-4 px-2">
                <div className="bg-gradient-to-b from-[#72CDAE] to-[#328E6E] rounded-2xl w-full max-w-[360px] mx-auto p-4 pt-3 shadow-lg relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm font-medium opacity-70">Watering Streak!</span>
                        <span className="text-white text-xs font-medium flex items-center gap-1">2025 <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    </div>
                    <div className="bg-[#328E6E]/80 rounded-xl p-2 flex flex-col items-center justify-center min-h-[220px] w-full relative">
                        <Suspense>
                            <Calendar
                                mode="single"
                                selected={new Date()}
                                className="bg-transparent text-white text-xs w-full"
                            />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* Your Plants - di luar kotak hijau */}
            <div className="px-4 py-5 space-y-3 bg-white w-full max-w-[360px] mx-auto">
                <p className="text-md font-semibold">Your Plants!</p>
                {[1, 2].map((item) => (
                    <Card key={item} className="flex items-center p-2 shadow-sm">
                        <Image
                            src="/assets/images/sawi1.png"
                            alt="Sawi Plant"
                            width={50}
                            height={50}
                            className="rounded-lg"
                        />
                        <div className="ml-3 flex-1">
                            <p className="font-medium">Sawi Plant</p>
                        </div>
                        <Button size="sm" className="bg-[#328E6E] hover:bg-[#5bb395] text-white">
                            Check
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
