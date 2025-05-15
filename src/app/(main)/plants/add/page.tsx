// src/app/(main)/plants/add/page.tsx
"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/client';
import type { Plant } from '@/types';
import { CalendarIcon, Sprout, Image as ImageIcon, FileText, ArrowLeft } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';


const plantSchema = z.object({
  name: z.string().min(3, { message: "Nama tanaman minimal 3 karakter." }),
  species: z.string().min(3, { message: "Spesies tanaman minimal 3 karakter." }).default("Sawi Hijau"),
  datePlanted: z.date({ required_error: "Tanggal tanam wajib diisi." }),
  notes: z.string().optional(),
  photo: z.instanceof(FileList).optional(),
});

type PlantFormValues = z.infer<typeof plantSchema>;

export default function AddPlantPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: '',
      species: 'Sawi Hijau',
      datePlanted: new Date(),
      notes: '',
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      form.setValue('photo', event.target.files);
    }
  };

  const onSubmit = async (data: PlantFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "Anda harus login untuk menambah tanaman.", variant: "destructive" });
      return;
    }
    setLoading(true);

    let photoURL: string | undefined = undefined;
    if (data.photo && data.photo.length > 0) {
      const file = data.photo[0];
      const storageRef = ref(storage, `users/${user.uid}/plants/${Date.now()}_${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading photo: ", error);
        toast({ title: "Upload Foto Gagal", description: "Gagal mengunggah foto tanaman.", variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    try {
      const plantData: Omit<Plant, 'id'> = {
        userId: user.uid,
        name: data.name,
        species: data.species,
        datePlanted: serverTimestamp.fromDate(data.datePlanted),
        notes: data.notes,
        photoURL: photoURL,
      };
      await addDoc(collection(db, `users/${user.uid}/plants`), plantData);
      toast({ title: "Tanaman Ditambahkan!", description: `${data.name} berhasil ditambahkan.` });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error adding plant:", error);
      toast({
        title: "Gagal Menambah Tanaman",
        description: error.message || "Terjadi kesalahan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
         <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Sprout className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl">Tambah Tanaman Baru</CardTitle>
            <CardDescription>Isi detail tanaman Sawi Hijau Anda.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Tanaman</Label>
            <Input id="name" placeholder="Mis: Sawi di Pot Merah" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">Spesies</Label>
            <Input id="species" placeholder="Sawi Hijau" {...form.register('species')} />
            {form.formState.errors.species && <p className="text-sm text-destructive">{form.formState.errors.species.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="datePlanted">Tanggal Tanam</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch('datePlanted') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('datePlanted') ? format(form.watch('datePlanted')!, "PPP", { locale: require('date-fns/locale/id') }) : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch('datePlanted')}
                  onSelect={(date) => form.setValue('datePlanted', date as Date, { shouldValidate: true })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.datePlanted && <p className="text-sm text-destructive">{form.formState.errors.datePlanted.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Foto Tanaman (Opsional)</Label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <Image src={imagePreview} alt="Preview" width={80} height={80} className="rounded-md object-cover h-20 w-20" data-ai-hint="plant seedling" />
              )}
              <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="cursor-pointer" />
            </div>
            {form.formState.errors.photo && <p className="text-sm text-destructive">{form.formState.errors.photo.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea id="notes" placeholder="Catatan tambahan tentang tanaman ini..." {...form.register('notes')} />
            {form.formState.errors.notes && <p className="text-sm text-destructive">{form.formState.errors.notes.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Tanaman'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
