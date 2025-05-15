'use client';

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="bg-[rgb(50,142,110)] p-4 rounded-b-3xl w-full relative" style={{ height: "350px" }}>
        <div
          style={{
            background: "linear-gradient(353.24deg, #72CDAE -100.3%, #328E6E 113.41%)",
            width: "361px",
            height: "49px",
            left: "16px",
            borderRadius: "14px",
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            fontSize: "14px",
            fontWeight: "500",
            color: "white",
          }}
        >
          <p className="text-xs">Watering Streak!</p>
          <div className="text-sm">2025 ▾</div>
        </div>

        <Card className="rounded-lg bg-[#328E6E] text-white border-none shadow-none" style={{
          width: "381px",
          height: "288px",
          top: "62px",
          left: "6px",
          position: "absolute",
          padding: "10px",
        }}>
          <CardContent className="flex justify-center items-center bg-[#72CDAE] border-none shadow-none" style={{
            width: "365px",
            height: "268px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Suspense>
              <Calendar
                mode="single"
                selected={new Date()}
                className="bg-transparent text-white text-xs"
                style={{
                  width: "335px",
                  height: "256px",
                  rowGap: "2px"
                }}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>

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

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner flex justify-around py-3">
        <div className="flex flex-col items-center text-green-600">
          {/* Placeholder for icons */}
        </div>
      </div>
    </div>
  );
}
