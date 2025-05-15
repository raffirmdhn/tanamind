'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { submitGrowthReportAction } from '@/actions/reportActions';
import { ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Plant } from '@/types';

const reportSchema = z.object({
  plantId: z.string().min(1, { message: "Pilih tanaman terlebih dahulu." }),
  plantHeight: z.string().min(1, { message: "Tinggi tanaman wajib diisi." }),
  leafCount: z.string().min(1, { message: "Jumlah daun wajib diisi." }),
  environmentalCondition: z.string().min(1, { message: "Kondisi lingkungan wajib diisi." }),
  photo: z.instanceof(FileList).refine(files => files.length > 0, "Foto tanaman wajib diunggah."),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
      plantHeight: '',
      leafCount: '',
      environmentalCondition: '',
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
        form.setValue('plantId', plantsData[0].id);
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
      form.setValue('photo', new DataTransfer().files, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "Anda harus login.", variant: "destructive" });
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('plantId', data.plantId);
    formData.append('plantHeight', data.plantHeight);
    formData.append('leafCount', data.leafCount);
    formData.append('environmentalCondition', data.environmentalCondition);
    formData.append('photo', data.photo[0]);
    formData.append('userId', user.uid);

    try {
      const result = await submitGrowthReportAction(formData);
      if (result.success) {
        toast({ title: "Berhasil", description: "Laporan pertumbuhan berhasil dikirim." });
        // Optional reset
      } else {
        toast({ title: "Gagal", description: result.error || "Terjadi kesalahan.", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Terjadi kesalahan.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="ml-2">Memuat formulir laporan...</span></div>}>
      {loading && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center text-center px-4">
          <p className="text-sm mb-4 text-muted-foreground">Hang tight! AI is working on the analysis.</p>
          <Image
            src="/assets/images/logo10.svg"
            alt="AI loading"
            width={100}
            height={100}
            className="mb-6"
          />
          <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-1/3 animate-pulse"></div>
          </div>
        </div>
      )}

      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-lg">Track Growth Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="plantHeight">Plant Height</Label>
              <Input id="plantHeight" placeholder="0 cm" {...form.register('plantHeight')} />
              {form.formState.errors.plantHeight && <p className="text-sm text-destructive">{form.formState.errors.plantHeight.message}</p>}
            </div>

            <div>
              <Label htmlFor="leafCount">Number of Leaves</Label>
              <Input id="leafCount" placeholder="0 leaf" {...form.register('leafCount')} />
              {form.formState.errors.leafCount && <p className="text-sm text-destructive">{form.formState.errors.leafCount.message}</p>}
            </div>

            <div>
              <Label htmlFor="environmentalCondition">Environmental Condition</Label>
              <Textarea id="environmentalCondition" placeholder="Type here..." {...form.register('environmentalCondition')} />
              {form.formState.errors.environmentalCondition && <p className="text-sm text-destructive">{form.formState.errors.environmentalCondition.message}</p>}
            </div>

            <div>
              <Label htmlFor="photo">Your plant’s current photo</Label>
              {imagePreview && (
                <div className="mt-2 mb-2 w-full h-48 relative rounded-md overflow-hidden border">
                  <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                </div>
              )}
              <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-1 text-sm text-muted-foreground">Click to upload or drag a photo</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, JPEG</p>
                </div>
                <Input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
              {form.formState.errors.photo && <p className="text-sm text-destructive">{form.formState.errors.photo.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading || fetchingPlants}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <>Analyze with AI</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Suspense>
  );
}
