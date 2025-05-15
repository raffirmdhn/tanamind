// src/components/auth/LoginForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth, googleAuthProvider } from "@/lib/firebase/client";
import { signInWithPopup } from "firebase/auth";
import { Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleAuthProvider);
      toast({ title: "Login Google Berhasil!", description: "Selamat datang." });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({
        title: "Login Google Gagal",
        description: error.message || "Terjadi kesalahan saat login dengan Google.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-sm p-8 space-y-6 bg-card rounded-xl shadow-xl'>
      <div className='flex flex-col items-center space-y-2'>
        <Leaf className='w-12 h-12 text-primary' />
        <h1 className='text-3xl font-bold text-primary'>Masuk ke Tanamind</h1>
        <p className='text-muted-foreground text-center'>Pantau pertumbuhan tanaman Anda.</p>
      </div>

      <Button variant='outline' className='w-full' onClick={handleGoogleSignIn} disabled={loading}>
        <svg
          className='mr-2 h-4 w-4'
          aria-hidden='true'
          focusable='false'
          data-prefix='fab'
          data-icon='google'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 488 512'>
          <path
            fill='currentColor'
            d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'></path>
        </svg>
        Google
      </Button>
    </div>
  );
}
