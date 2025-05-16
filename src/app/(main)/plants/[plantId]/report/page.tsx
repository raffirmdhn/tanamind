"use client";

import { submitGrowthReportAction } from "@/actions/reportAction";
import AnalyzedResult from "@/components/PlantReport/AnalyzedResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePlantData } from "@/hooks/usePlantData";
import { reportQuestion } from "@/lib/report-question";
import { doTheDayIsTheDay } from "@/lib/site";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const reportSchema = z.object({
  plantId: z.string().min(1, { message: "Pilih tanaman terlebih dahulu." }),
  plantHeight: z
    .string()
    // .min(1, { message: "Tinggi tanaman tidak boleh kosong" })
    .refine(val => !isNaN(Number(val)), { message: "Tinggi tanaman harus berupa angka" })
    // .refine(val => Number(val) >= 1, { message: "Tinggi tanaman minimal 1 cm" })
    .refine(val => Number(val) <= 100, { message: "Tinggi tanaman maksimal 100 cm" })
    .optional(),
  leafCount: z
    .string()
    // .min(1, { message: "Jumlah daun tidak boleh kosong" })
    .refine(val => !isNaN(Number(val)), { message: "Jumlah daun harus berupa angka" })
    // .refine(val => Number(val) >= 1, { message: "Jumlah daun minimal 1 helai" })
    .refine(val => Number(val) <= 100, { message: "Jumlah daun maksimal 100 helai" })
    .optional(),
  leafCondition: z
    .string()
    // .min(3, { message: "Kondisi daun minimal 3 karakter" })
    .optional(),
  temperature: z
    .string()
    // .min(1, { message: "Suhu lingkungan tidak boleh kosong" })
    .refine(val => !isNaN(Number(val)), { message: "Suhu lingkungan harus berupa angka" })
    // .refine(val => Number(val) >= 1, { message: "Suhu lingkungan minimal 1 °C" })
    .refine(val => Number(val) <= 50, { message: "Suhu lingkungan maksimal 50 °C" })
    .optional(),
  sunlight: z
    .string()
    // .min(1, { message: "Lama sinar matahari tidak boleh kosong" })
    .refine(val => !isNaN(Number(val)), { message: "Lama sinar matahari harus berupa angka" })
    // .refine(val => Number(val) >= 1, { message: "Lama sinar matahari minimal 1 jam" })
    .refine(val => Number(val) <= 24, { message: "Lama sinar matahari maksimal 24 jam" })
    .optional(),
  waterFrequency: z
    .string()
    // .min(1, { message: "Frekuensi penyiraman tidak boleh kosong" })
    .refine(val => !isNaN(Number(val)), { message: "Frekuensi penyiraman harus berupa angka" })
    // .refine(val => Number(val) >= 1, { message: "Frekuensi penyiraman minimal 1 kali" })
    .refine(val => Number(val) <= 7, { message: "Frekuensi penyiraman maksimal 7 kali" })
    .optional(),
  plantSymptoms: z
    .string()
    // .min(3, { message: "Gejala minimal 3 karakter" })
    .optional(),
  freshWeight: z
    .string()
    // .min(1, { message: "Bobot segar tidak boleh kosong" })
    .refine(val => !isNaN(Number(val)), { message: "Bobot segar harus berupa angka" })
    // .refine(val => Number(val) >= 1, { message: "Bobot segar minimal 1 gram" })
    .refine(val => Number(val) <= 1000, { message: "Bobot segar maksimal 1000 gram" })
    .optional(),
  photo: z
    .any()
    .refine(files => files?.length > 0, "Foto tanaman wajib diunggah.")
    .refine(files => files?.[0]?.size <= 2_000_000, "Ukuran file maksimal 2MB.")
    .refine(
      files => ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      "Hanya format .jpg, .jpeg, .png, dan .webp yang diperbolehkan."
    ),
});

export type ReportFormValues = z.infer<typeof reportSchema>;

export default function PlantReportPage() {
  const params = useParams();
  const plantId = params.plantId as string;

  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { plant, loading } = usePlantData(user?.uid, plantId);
  // Redirect to plant detail page if the last growth report date is today
  useEffect(() => {
    if (
      plant &&
      plant.lastGrowthReportDate &&
      doTheDayIsTheDay(plant.lastGrowthReportDate.toDate())
    ) {
      router.push("/plants/" + plantId);
    }
  }, [plant, router, plantId]);

  const [analyzedReport, setAnalyzedReport] = useState<{
    grade: string;
    additionalNotes: string;
    recommendedActions: string;
  }>({ additionalNotes: "", grade: "", recommendedActions: "" });

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      plantId: plantId || "",
      plantHeight: "",
      leafCount: "",
      freshWeight: "",
      leafCondition: "",
      temperature: "",
      plantSymptoms: "",
      sunlight: "",
      waterFrequency: "",
      photo: undefined, // Instead of null
    },
    mode: "onChange", // Important for real-time validation
  });

  useEffect(() => {
    if (plantId) {
      form.setValue("plantId", plantId);
    }
  }, [plantId, form]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      form.setValue("photo", files, { shouldValidate: true });
    } else {
      setImagePreview(null);
      form.setValue("photo", null, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "Anda harus login.", variant: "destructive" });
      return;
    }
    if (!plant) {
      toast({ title: "Error", description: "Tanaman tidak ditemukan.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await submitGrowthReportAction({
        photo: data.photo[0],
        plantId: plantId,
        userId: user.uid,
        plantingDate: plant.plantingDate.toDate().getTime(),

        plantHeight: data.plantHeight,
        leafCount: data.leafCount,
        leafCondition: data.leafCondition,
        temperature: data.temperature,
        sunlight: data.sunlight,
        waterFrequency: data.waterFrequency,
        plantSymptoms: data.plantSymptoms,
        freshWeight: data.freshWeight,
      });
      toast({
        title: result.message,
        // @ts-expect-error
        variant: result.variant,
      });

      if (result.data) {
        setAnalyzedReport({
          grade: result.data.grade,
          additionalNotes: result.data.additionalNotes,
          recommendedActions: result.data.recommendedActions,
        });
      }
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
    console.log("Is form valid?", form.formState.isValid);
  }, [form.formState.errors, form.formState.isValid]);

  // Defining which week it is based on the planting date
  const reportDate = new Date();
  const diffInMs = reportDate.getTime() - (plant?.plantingDate.toDate().getTime() || 0);
  let currentWeek = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1;
  if (currentWeek <= 0) currentWeek = 1; // If week 0 or negative, set to week 1
  const filteredQuestions = useMemo(
    () => reportQuestion.filter(q => q.week.includes(currentWeek)),
    [currentWeek]
  );

  if (loading || !plant) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <span className='ml-2'>Memuat data tanaman...</span>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <span className='ml-2'>Memuat formulir laporan...</span>
        </div>
      }>
      {isSubmitting && (
        <div className='fixed inset-0 z-50 bg-white flex flex-col items-center justify-center text-center px-4'>
          <p className='text-sm mb-4 text-muted-foreground'>
            Hang tight! AI is working on the analysis.
          </p>
          <Image
            src='/assets/images/logo10.svg'
            alt='AI loading'
            width={100}
            height={100}
            className='mb-6'
          />
          <div className='w-40 h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div className='h-full bg-green-500 w-1/3 animate-pulse'></div>
          </div>
        </div>
      )}

      <Card className='w-full max-w-sm mx-auto'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' onClick={() => router.back()}>
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <CardTitle className='text-lg'>Track Growth Progress Week {currentWeek}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            {filteredQuestions.map(question => (
              <div key={question.key}>
                <Label htmlFor={question.key}>{question.question}</Label>

                {question.type === "number" ? (
                  <Input
                    id={question.key}
                    placeholder={question.placeholder}
                    type='number'
                    {...form.register(question.key)}
                  />
                ) : (
                  <Textarea
                    id={question.key}
                    placeholder={question.placeholder}
                    {...form.register(question.key)}
                  />
                )}

                {form.formState.errors[question.key] && (
                  <p className='text-sm text-destructive'>
                    {form.formState.errors[question.key]?.message as string}
                  </p>
                )}
              </div>
            ))}

            <div>
              <Label htmlFor='photo'>Your plant's current photo</Label>
              {imagePreview && (
                <div className='mt-2 mb-2 w-full h-48 relative rounded-md overflow-hidden border'>
                  <Image src={imagePreview} alt='Preview' fill className='object-contain' />
                </div>
              )}
              <label
                htmlFor='photo-upload'
                className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80'>
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <ImageIcon className='w-8 h-8 mb-2 text-muted-foreground' />
                  <p className='mb-1 text-sm text-muted-foreground'>
                    Click to upload or drag a photo
                  </p>
                  <p className='text-xs text-muted-foreground'>JPG, JPEG (max 2MB)</p>
                </div>
                <Input
                  id='photo-upload'
                  type='file'
                  className='hidden'
                  accept='.jpg,.jpeg,image/jpeg'
                  onChange={handlePhotoChange}
                />
              </label>
              {form.formState.errors.photo && (
                <p className='text-sm text-destructive'>
                  {form.formState.errors.photo?.message as string}
                </p>
              )}
            </div>

            <Button type='submit' className='w-full' disabled={loading || !!analyzedReport.grade}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Analyzing...
                </>
              ) : (
                <>Analyze with AI</>
              )}
            </Button>
          </form>

          {/* Anlyzed Result */}
          {!!analyzedReport.grade && (
            <>
              <AnalyzedResult analyzedReport={analyzedReport} />

              <div className='flex justify-center'>
                <Button
                  variant='outline'
                  className='w-full max-w-sm mt-4'
                  onClick={() => router.push("/plants/" + plantId)}>
                  Back to Plants
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </Suspense>
  );
}
