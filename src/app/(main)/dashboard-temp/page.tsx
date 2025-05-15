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
  // Simulasi: tidak ada tanaman
  const plants = [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-[393px] min-h-screen bg-white flex flex-col items-center relative shadow-xl">
        {/* Kalender */}
        <div className="w-full flex flex-col items-center mt-8 px-2">
          <div className="bg-gradient-to-b from-[#72CDAE] to-[#328E6E] rounded-2xl w-full max-w-[360px] mx-auto p-4 pt-3 shadow-lg relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm font-medium opacity-70">Watering Calendar!</span>
              <span className="text-white text-xs font-medium flex items-center gap-1">2025 <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </div>
            <div className="bg-[#328E6E]/80 rounded-xl p-2 flex flex-col items-center justify-center min-h-[220px] w-full relative">
              <Calendar
                mode="single"
                selected={new Date()}
                className="bg-transparent text-white text-xs w-full"
              />
              {plants.length === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className="bg-[#72CDAE] text-white text-xs px-4 py-1 rounded-lg shadow">No Plants found yet!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ilustrasi dan pesan kosong */}
        {plants.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 mt-8 mb-24 w-full">
            <div className="w-full flex justify-center">
              <Image
                src="/assets/images/sad-plant.png"
                alt="Sad Plant"
                width={140}
                height={140}
                className="mb-4"
                onError={(e) => {
                  // @ts-ignore
                  e.target.src = 'https://via.placeholder.com/140x140?text=No+Image';
                }}
              />
            </div>
            <span className="text-gray-400 text-base text-center">You haven't planted anything yet :(</span>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 h-[108px] border-t bg-white shadow-inner z-40 w-full flex justify-center">
          <div className="flex h-full items-center justify-between px-6 w-full max-w-[393px] mx-auto">
            {/* Isi dari BottomNav akan diinject oleh komponen global */}
          </div>
        </nav>
      </div>
    </div>
  );
}
