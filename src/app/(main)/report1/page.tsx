"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

const ReportPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastWatered, setLastWatered] = useState("3 hours ago");

  const handleWaterPlant = () => {
    setLastWatered("Just now");
    setShowModal(false);

    // Tampilkan modal sukses setelah konfirmasi OK
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300); // sedikit delay biar transisi lebih halus
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-white px-4 pt-6 pb-4 relative">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-2 mb-6">
        <Link href="/">
          <span className="text-[#328e6e] text-2xl font-bold cursor-pointer">&lt;</span>
        </Link>
        <h2 className="text-base font-medium text-gray-800">Sawi Plant</h2>
        <div className="w-5 h-5" />
      </div>

      {/* Gambar Tanaman */}
      <div className="w-full rounded-2xl overflow-hidden mb-6">
        <Image
          src="/assets/images/sawi1.png"
          alt="Sawi Plant"
          width={340}
          height={170}
          className="w-full h-[170px] object-cover rounded-2xl"
        />
      </div>

      {/* Info Penyiraman & Penanaman */}
      <div className="w-full flex justify-between items-center mb-4">
        <div className="w-[158px] h-[60px] border border-[#328e6e] rounded-xl flex items-center px-3">
          <Clock className="w-4 h-4 text-[#328e6e] mr-2" />
          <div>
            <p className="text-[11px] text-gray-500">Last watered</p>
            <p className="text-sm font-medium" style={{ color: '#32866e' }}>{lastWatered}</p>
          </div>
        </div>
        <div className="w-[158px] h-[60px] border border-[#328e6e] rounded-xl flex items-center px-3">
          <Calendar className="w-4 h-4 text-[#328e6e] mr-2" />
          <div>
            <p className="text-[11px] text-gray-500">Planted on</p>
            <p className="text-sm font-medium" style={{ color: '#32866e' }}>3 May 2025</p>
          </div>
        </div>
      </div>

      {/* Kondisi Tanaman */}
      <Card className="w-full h-[70px] border border-[#a8ddd1] bg-[#e3f6f1] rounded-xl shadow-sm mb-6">
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
      <div className="w-full flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full border border-[#328e6e] text-[#328e6e] hover:bg-[#e3f6f1] font-medium text-sm rounded-xl h-10"
          onClick={() => setShowModal(true)}
        >
          Water Plant 🪣
        </Button>
        <Button
          className="w-full bg-[#328e6e] hover:bg-[#28765c] text-white font-medium text-sm rounded-xl h-10"
        >
          Report Growth Plant 📈
        </Button>
      </div>

      {/* Modal Konfirmasi Penyiraman */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-5 shadow-md relative"
            style={{ width: "395px", height: "171px" }}
          >
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3 className="text-sm font-semibold text-gray-800 mb-1 text-center w-full">
              Did you water the plant?
            </h3>
            <div className="flex justify-center gap-3 absolute bottom-4 left-0 right-0">
              <Button
                variant="outline"
                className="w-[143px] h-[33.3px] border border-gray-300 text-gray-700 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-[143px] h-[33.3px] bg-[#328e6e] hover:bg-[#28765c] text-white rounded-md"
                onClick={handleWaterPlant}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Success Watered */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 shadow-md text-center relative" style={{ width: "359px", height: "342px" }}>
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl"
              onClick={() => setShowSuccessModal(false)}
            >
              ×
            </button>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Successfully Watered!</h3>
            <p className="text-xs text-gray-500 mb-4">Thank you for watering the plant!</p>
            <Image
              src="/assets/images/logo10.svg"
              alt="Success"
              width={200}
              height={200}
              className="mx-auto my-4"
            />
            <Button
              className="w-[317px] h-[33.3px] bg-[#328e6e] hover:bg-[#28765c] text-white font-medium text-sm rounded-md absolute left-1/2 -translate-x-1/2 bottom-6"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
