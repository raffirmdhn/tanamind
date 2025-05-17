"use client";
import { addPlant } from "@/actions/plantAction";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowLeft, CalendarIcon, Sprout } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const plantSchema = z.object({
  name: z.string().min(3, { message: "Nama tanaman minimal 3 karakter." }),
  species: z
    .string()
    .min(3, { message: "Spesies tanaman minimal 3 karakter." })
    .default("Sawi Hijau"),
  plantingDate: z.date({ required_error: "Tanggal tanam wajib diisi." }),
  notes: z.string().optional(),
  photo: z.instanceof(FileList).optional(),
});

export type PlantFormValues = z.infer<typeof plantSchema>;

export default function AddPlantPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: "",
      species: "Sawi Hijau",
      plantingDate: new Date(),
      notes: "",
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      form.setValue("photo", event.target.files);
    }
  };

  const onSubmit = async (data: PlantFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login untuk menambah tanaman.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    const result = await addPlant({
      name: data.name,
      plantingDate: data.plantingDate,
      species: data.species,
      notes: data.notes,
      photo: data.photo ? data.photo[0] : undefined,
      userId: user.uid,
    });
    setLoading(false);

    toast({
      title: result.message,
      description: result.description,
      // @ts-expect-error
      variant: result.variant,
    });
    if (result.success) {
      router.push("/dashboard");
    }
  };

  return (
    <Card className='w-full max-w-lg mx-auto'>
      <CardHeader>
        <div className='flex items-center gap-2 mb-2'>
          <Button variant='ghost' size='icon' onClick={() => router.back()} className='mr-2'>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <Sprout className='h-8 w-8 text-primary' />
          <div>
            <CardTitle className='text-2xl'>Tambah Tanaman Baru</CardTitle>
            <CardDescription>Isi detail tanaman Anda.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nama Tanaman</Label>
            <Input id='name' placeholder='Mis: Sawi di Pot Merah' {...form.register("name")} />
            {form.formState.errors.name && (
              <p className='text-sm text-destructive'>{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='species'>Spesies</Label>
            <Select
              defaultValue='Sawi Hijau'
              onValueChange={value => form.setValue("species", value, { shouldValidate: true })}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Pilih Spesies' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Sawi Hijau'>Sawi Hijau</SelectItem>
                <SelectItem value='Sawi Putih'>Sawi Putih</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.species && (
              <p className='text-sm text-destructive'>{form.formState.errors.species.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='plantingDate'>Tanggal Tanam</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("plantingDate") && "text-muted-foreground"
                  )}>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {!!form.watch("plantingDate") &&
                    format(form.watch("plantingDate"), "PPP", {
                      locale: id,
                    })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={form.watch("plantingDate")}
                  onSelect={date =>
                    form.setValue("plantingDate", date as Date, { shouldValidate: true })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.plantingDate && (
              <p className='text-sm text-destructive'>
                {form.formState.errors.plantingDate.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='photo'>Foto Tanaman (Opsional)</Label>
            <div className='flex items-center gap-4'>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt='Preview'
                  width={80}
                  height={80}
                  className='rounded-md object-cover h-20 w-20'
                  data-ai-hint='plant seedling'
                />
              )}
              <Input
                id='photo'
                type='file'
                accept='image/*'
                onChange={handlePhotoChange}
                className='cursor-pointer'
              />
            </div>
            {form.formState.errors.photo && (
              <p className='text-sm text-destructive'>{form.formState.errors.photo.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='notes'>Catatan (Opsional)</Label>
            <Textarea
              id='notes'
              placeholder='Catatan tambahan tentang tanaman ini...'
              {...form.register("notes")}
            />
            {form.formState.errors.notes && (
              <p className='text-sm text-destructive'>{form.formState.errors.notes.message}</p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Tanaman"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
