// src/app/(main)/onboarding/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Disc3, Droplets, Sun, Sprout } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    title: "2. Penyemaian Benih",
    icon: Sprout,
    details: [
      "Rendam benih Sawi Hijau dalam air hangat selama 1-2 jam sebelum tanam.",
      "Buat lubang tanam sedalam 0.5 - 1 cm pada media tanam.",
      "Masukkan 2-3 benih per lubang, lalu tutup tipis dengan tanah.",
      "Siram perlahan hingga media tanam lembab.",
    ],
    image: "https://picsum.photos/seed/planting/400/200",
    aiHint: "planting seedling"
  },
  {
    title: "3. Perawatan Awal",
    icon: Droplets,
    details: [
      "Letakkan semaian di tempat yang teduh namun tetap mendapat cahaya matahari tidak langsung.",
      "Jaga kelembaban media tanam, jangan sampai kering atau terlalu basah.",
      "Benih biasanya akan berkecambah dalam 3-7 hari.",
    ],
    image: "https://picsum.photos/seed/watering/400/200",
    aiHint: "watering plant"
  },
  {
    title: "4. Pemindahan & Penyinaran",
    icon: Sun,
    details: [
      "Setelah tanaman memiliki 3-4 daun sejati (sekitar 2-3 minggu), pindahkan ke pot yang lebih besar jika diperlukan atau lakukan penjarangan.",
      "Kenalkan tanaman pada sinar matahari penuh secara bertahap.",
      "Sawi Hijau membutuhkan minimal 4-6 jam sinar matahari langsung per hari.",
    ],
    image: "https://picsum.photos/seed/sunlight/400/200",
    aiHint: "plant sunlight"
  },
  {
    title: "5. Pemupukan & Panen",
    icon: Disc3, // Placeholder for fertilizer/harvest
    details: [
      "Berikan pupuk organik cair setiap 2 minggu sekali setelah tanaman berusia 1 bulan.",
      "Sawi Hijau umumnya siap panen dalam 30-45 hari setelah tanam.",
      "Panen dengan memotong pangkal batang atau mencabut seluruh tanaman.",
    ],
    image: "https://picsum.photos/seed/harvest/400/200",
    aiHint: "harvest vegetable"
  },
];

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          {/* <Seedling className="mx-auto h-16 w-16 text-primary mb-2" /> */}
          <CardTitle className="text-3xl font-bold text-primary">Panduan Menanam Sawi Hijau</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Ikuti langkah-langkah mudah ini untuk memulai kebun Sawi Hijau Anda!
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        {steps.map((step, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg hover:no-underline">
              <div className="flex items-center gap-3">
                <step.icon className="h-6 w-6 text-secondary" />
                <span>{step.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 px-1 pt-2">
              {step.image && (
                <div className="w-full h-40 relative rounded-md overflow-hidden my-2">
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-md"
                    data-ai-hint={step.aiHint}
                  />
                </div>
              )}
              <ul className="list-none space-y-2 pl-2">
                {step.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
       <Card>
        <CardHeader>
          <CardTitle>Tips Tambahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <p className="flex items-start gap-2"><Droplets className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" /> <strong>Penyiraman:</strong> Siram secara teratur, terutama saat musim kemarau. Pastikan tanah lembab, bukan becek.</p>
            <p className="flex items-start gap-2"><Disc3 className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" /> <strong>Hama & Penyakit:</strong> Periksa tanaman secara rutin. Gunakan pestisida nabati jika diperlukan.</p>
            <p className="flex items-start gap-2"><Sun className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" /> <strong>Suhu Ideal:</strong> Sawi tumbuh baik pada suhu 15-25°C.</p>
        </CardContent>
      </Card>
    </div>
  );
}
