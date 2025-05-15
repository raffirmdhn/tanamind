"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";

const ReportPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-6 pb-4">
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between px-2 mb-[40px]">
        <Link href="/">
          <span className="text-[#328e6e] text-2xl font-bold cursor-pointer">&lt;</span>
        </Link>
        <h2 className="text-base font-medium text-gray-800">Sawi Plant</h2>
        <div className="w-5 h-5" />
      </div>

      {/* Gambar Tanaman */}
      <div className="w-full max-w-sm rounded-2xl overflow-hidden mb-[40px]">
        <Image
          src="/assets/images/sawi1.png"
          alt="Sawi Plant"
          width={340}
          height={200}
          className="w-full h-[170px] object-cover rounded-2xl"
        />
      </div>

      {/* Informasi Penyiraman & Penanaman */}
      <div className="w-full max-w-sm flex justify-between items-center mb-4">
        <div className="w-[158px] h-[60px] border border-[#328e6e] rounded-xl flex items-center px-3">
          <Clock className="w-4 h-4 text-[#328e6e] mr-2" />
          <div>
            <p className="text-[11px] text-gray-500">Last watered</p>
            <p className="text-sm font-medium text-gray-800">3 hours ago</p>
          </div>
        </div>
        <div className="w-[158px] h-[60px] border border-[#328e6e] rounded-xl flex items-center px-3">
          <Calendar className="w-4 h-4 text-[#328e6e] mr-2" />
          <div>
            <p className="text-[11px] text-gray-500">Planted on</p>
            <p className="text-sm font-medium text-gray-800">3 May 2025</p>
          </div>
        </div>
      </div>

      {/* Kondisi Tanaman */}
      <Card className="w-full max-w-sm h-[70px] border border-[#a8ddd1] bg-[#e3f6f1] rounded-xl shadow-sm mb-[40px]">
        <CardContent className="flex items-center h-full px-4 py-2 gap-3">
          <div className="w-8 h-8 rounded-full bg-[#328e6e] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div className="flex flex-col">
            <p className="text-[12px] text-gray-600 font-medium leading-tight">
              Your Plant Condition’s
            </p>
            <p className="text-sm font-semibold text-[#328e6e] leading-tight">
              Excellent
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tombol Aksi */}
      <div className="w-full max-w-sm flex flex-col gap-3 mt-auto">
        <Button
          variant="outline"
          className="w-full border border-[#328e6e] text-[#328e6e] hover:bg-[#e3f6f1] font-medium text-sm rounded-xl h-10"
        >
          Water Plant 🪣
        </Button>
        <Button
          className="w-full bg-[#328e6e] hover:bg-[#28765c] text-white font-medium text-sm rounded-xl h-10"
        >
          Report Growth Plant 📈
        </Button>
      </div>
    </div>
  );
};

export default ReportPage;
