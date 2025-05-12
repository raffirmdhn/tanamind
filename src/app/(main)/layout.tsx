// src/app/(main)/layout.tsx
"use client";
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TopNav from '@/components/layout/TopNav';
import BottomNav from '@/components/layout/BottomNav';
import { Loader2 } from 'lucide-react';

export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   router.replace('/dashboard-temp')
  //   return
  //   console.log('user', user)
  //   if (!loading && !user) {
  //     router.replace('/auth/login');
  //   }
  // }, [user, loading, router]);

  // if (loading) {
  //   return (
  //     <div className="flex flex-col flex-grow items-center justify-center h-full">
  //       <Loader2 className="h-12 w-12 animate-spin text-primary" />
  //       <p className="mt-4 text-muted-foreground">Memuat data pengguna...</p>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   // This case should ideally be handled by the redirect,
  //   // but as a fallback, show loading or nothing.
  //   return null; 
  // }

  return (
    <div className="flex flex-col h-full">
      <TopNav />
      <main className="flex-grow overflow-y-auto pb-20 "> 
        {/* pb-20 to make space for bottom nav, pt-4 for spacing from top nav */}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
