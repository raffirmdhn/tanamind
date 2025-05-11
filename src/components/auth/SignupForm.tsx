// src/components/auth/SignupForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider, db } from '@/lib/firebase/client';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Leaf, User, Mail, KeyRound } from 'lucide-react';
import Link from 'next/link';
import type { UserProfile } from '@/types';

const signupSchema = z.object({
  displayName: z.string().min(3, { message: "Nama minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
  });

  const createUserProfileDocument = async (user: import('firebase/auth').User, additionalData: Partial<UserProfile> = {}) => {
    const userRef = doc(db, `users/${user.uid}`);
    const profileData: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || additionalData.displayName || 'Pengguna Baru',
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      onboardingCompleted: false,
      ...additionalData,
    };
    await setDoc(userRef, profileData, { merge: true });
  };

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.displayName });
      await createUserProfileDocument(userCredential.user, { displayName: data.displayName });
      
      toast({ title: "Pendaftaran Berhasil!", description: "Akun Anda telah dibuat." });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Pendaftaran Gagal",
        description: error.message || "Terjadi kesalahan saat mendaftar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      await createUserProfileDocument(result.user);
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
        <h1 className="text-3xl font-bold text-primary">Daftar SawiKu</h1>
        <p className="text-muted-foreground text-center">Mulai perjalanan berkebun digital Anda.</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="displayName">Nama Lengkap</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="displayName"
              type="text"
              placeholder="Nama Anda"
              {...form.register('displayName')}
              className="pl-10"
            />
          </div>
          {form.formState.errors.displayName && (
            <p className="text-sm text-destructive">{form.formState.errors.displayName.message}</p>
          )}
        </div>
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
          {loading ? 'Memproses...' : 'Daftar'}
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
        Sudah punya akun?{' '}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
