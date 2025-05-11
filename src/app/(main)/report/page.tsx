// src/app/(main)/report/page.tsx
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { submitGrowthReportAction } from '@/actions/reportActions'; // Server Action
import { ArrowLeft, Lightbulb, Image as ImageIcon, HelpCircle, Loader2, Send } from 'lucide-react';
import Image from 'next/image';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Plant } from '@/types';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const reportSchema = z.object({
  plantId: z.string().min(1, { message: "Pilih tanaman terlebih dahulu." }),
  question: z.string().min(5, {message: "Pertanyaan minimal 5 karakter."}).max(500, {message: "Pertanyaan maksimal 500 karakter."}),
  photo: z.instanceof(FileList).refine(files => files.length > 0, "Foto tanaman wajib diunggah."),
  includeSpecificInfo: z.boolean().default(true),
  notes: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

function ReportFormContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userPlants, setUserPlants] = useState<Plant[]>([]);
  const [fetchingPlants, setFetchingPlants] = useState(true);

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlantId = searchParams.get('plantId');

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      plantId: preselectedPlantId || '',
      question: '',
      includeSpecificInfo: true,
      notes: '',
    },
  });

  useEffect(() => {
    if (preselectedPlantId) {
      form.setValue('plantId', preselectedPlantId);
    }
  }, [preselectedPlantId, form]);

  useEffect(() => {
    if (!user) return;

    setFetchingPlants(true);
    const plantsRef = collection(db, `users/${user.uid}/plants`);
    const q = query(plantsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plantsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plant));
      setUserPlants(plantsData);
      setFetchingPlants(false);
       if (plantsData.length > 0 && !preselectedPlantId) {
        form.setValue('plantId', plantsData[0].id); // Default to first plant if none preselected
      }
    }, (error) => {
      console.error("Error fetching plants:", error);
      toast({ title: "Error", description: "Gagal memuat daftar tanaman.", variant: "destructive" });
      setFetchingPlants(false);
    });
    return () => unsubscribe();
  }, [user, toast, form, preselectedPlantId]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      form.setValue('photo', event.target.files, { shouldValidate: true });
    } else {
      setImagePreview(null);
      form.setValue('photo', new DataTransfer().files, { shouldValidate: true }); // Clear value
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "Anda harus login.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setAiAdvice(null);

    const formData = new FormData();
    formData.append('plantId', data.plantId);
    formData.append('question', data.question);
    formData.append('photo', data.photo[0]);
    formData.append('includeSpecificInfo', String(data.includeSpecificInfo));
    if (data.notes) formData.append('notes', data.notes);
    formData.append('userId', user.uid);

    try {
      const result = await submitGrowthReportAction(formData);
      if (result.success && result.advice) {
        setAiAdvice(result.advice);
        toast({ title: "Saran Diterima!", description: "Saran pertumbuhan dari AI telah diterima." });
        // form.reset(); // Optionally reset form
        // setImagePreview(null);
      } else {
        toast({ title: "Gagal Mendapatkan Saran", description: result.error || "Terjadi kesalahan.", variant: "destructive" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const selectedPlant = userPlants.find(p => p.id === form.watch('plantId'));

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Lightbulb className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl">Lapor & Dapatkan Saran AI</CardTitle>
            <CardDescription>Unggah foto tanaman dan ajukan pertanyaan untuk saran pertumbuhan.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plantId">Pilih Tanaman</Label>
            <Controller
              control={form.control}
              name="plantId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={fetchingPlants || userPlants.length === 0}>
                  <SelectTrigger id="plantId" className="w-full">
                    <SelectValue placeholder={fetchingPlants ? "Memuat tanaman..." : (userPlants.length === 0 ? "Tidak ada tanaman" : "Pilih tanaman")} />
                  </SelectTrigger>
                  <SelectContent>
                    {userPlants.map(plant => (
                      <SelectItem key={plant.id} value={plant.id}>{plant.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.plantId && <p className="text-sm text-destructive">{form.formState.errors.plantId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Foto Tanaman Saat Ini</Label>
             {imagePreview && (
              <div className="mt-2 mb-2 w-full h-48 relative rounded-md overflow-hidden border">
                <Image src={imagePreview} alt="Preview Foto Tanaman" layout="fill" objectFit="contain" data-ai-hint="plant current state" />
              </div>
            )}
            <div className="flex items-center justify-center w-full">
                <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Klik untuk unggah</span> atau seret foto</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, atau GIF (MAX. 5MB)</p>
                    </div>
                    <Input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                </label>
            </div> 
            {form.formState.errors.photo && <p className="text-sm text-destructive">{form.formState.errors.photo.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Pertanyaan Anda</Label>
             <div className="relative">
                <HelpCircle className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Textarea
                id="question"
                placeholder="Contoh: Kenapa daun sawi saya menguning di bagian pinggir?"
                {...form.register('question')}
                rows={3}
                className="pl-10 pt-2"
                />
            </div>
            {form.formState.errors.question && <p className="text-sm text-destructive">{form.formState.errors.question.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
            <Textarea id="notes" placeholder="Catatan tambahan tentang kondisi tanaman, misal: baru disiram kemarin." {...form.register('notes')} />
          </div>
          
          <div className="flex items-center space-x-2">
            <Controller
              control={form.control}
              name="includeSpecificInfo"
              render={({ field }) => (
                 <Switch
                    id="includeSpecificInfo"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
              )} />
            <Label htmlFor="includeSpecificInfo" className="text-sm">Sertakan info spesifik dalam saran AI</Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading || fetchingPlants}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : <><Send className="mr-2 h-4 w-4" /> Dapatkan Saran AI</>}
          </Button>
        </form>

        {aiAdvice && (
          <Card className="mt-6 bg-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="text-yellow-400"/> Saran dari SawiKu AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{aiAdvice}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}


export default function ReportPage() {
  // Suspense boundary for useSearchParams
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Memuat formulir laporan...</span></div>}>
      <ReportFormContent />
    </Suspense>
  );
}
