// src/components/auth/LoginForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Leaf, Mail, KeyRound } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Login Berhasil!", description: "Selamat datang kembali." });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Gagal",
        description: error.message || "Terjadi kesalahan saat login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleAuthProvider);
      toast({ title: "Login Google Berhasil!", description: "Selamat datang." });
      router.push('/dashboard');
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
    <div className="w-full max-w-sm p-8 space-y-6 bg-card rounded-xl shadow-xl">
      <div className="flex flex-col items-center space-y-2">
        <Leaf className="w-12 h-12 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Masuk ke SawiKu</h1>
        <p className="text-muted-foreground text-center">Pantau pertumbuhan sawi hijau Anda.</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="email@contoh.com"
              {...form.register('email')}
              className="pl-10"
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register('password')}
              className="pl-10"
            />
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Atau lanjutkan dengan
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
        Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{' '}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
