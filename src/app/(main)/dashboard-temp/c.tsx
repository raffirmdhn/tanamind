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
        // Ratio 9:16
        <div className="min-h-screen bg-white flex flex-col items-center">
            {/* Bagian atas dengan background hijau dan lengkungan bawah */}
            <div className="bg-[rgb(50,142,110)] p-4 rounded-b-3xl w-full" style={{
                height: '350px'
            }}>
                {/* Header */}
                <div className="bg-[#72CDAE] text-white shadow-md" style={{
                    width: '361px',
                    height: '47px',
                    top: '76px',
                    left: '16px',
                    borderRadius: '14px',
                    borderWidth: '0.34px',
                    position: 'absolute'
                }}>
                    <div className="flex justify-between items-center px-4">
                        <div className="text-sm">2025 ▾</div>
                        <p className="text-xs">Watering Streak!</p>
                    </div>
                </div>

                {/* Kalender */}
                <Card className="rounded-lg shadow bg-[#328e6E] text-white border-none" style={{
                    width: '381px',
                    height: '288px',
                    top: '123px',
                    left: '6px',
                    gap: '10px',
                    padding: '10px',
                    position: 'absolute'
                }}>
                    <CardContent className="flex justify-center" style={{
                        width: '361px',
                        height: '268px',
                        borderRadius: '14px',
                        borderWidth: '0.34px'
                    }}>
                        <Suspense>
                            <Calendar
                                mode="single"
                                selected={new Date()}
                                className="bg-transparent text-white text-xs"
                                style={{
                                    width: '335px',
                                    height: '256px',
                                    gap: '18px'
                                }}
                            />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>

            {/* Your Plants */}
            <div className="px-6 py-6 space-y-2 bg-white w-[361px] h-[284px]">
                <p className="text-md font-semibold">Your Plants!</p>
                {[1, 2].map((item) => (
                    <div
                        key={item}
                        className="flex items-center p-2 rounded-lg shadow-sm bg-white w-[325px] h-[80px] mb-[19px]"
                    >
                        <Image
                            src="/assets/images/sawi1.png"
                            alt="Sawi Plant"
                            width={50}
                            height={50}
                            className="rounded-lg"
                        />
                        <div className="ml-3 flex-1">
                            <p className="font-medium text-sm">Sawi Plant</p>
                        </div>
                        <Button
                            size="sm"
                            className="bg-[#328E6E] hover:bg-[#5bb395] text-white"
                        >
                            Check
                        </Button>
                    </div>
                ))}
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