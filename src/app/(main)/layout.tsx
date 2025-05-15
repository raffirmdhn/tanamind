// src/app/(main)/layout.tsx
"use client";
import BottomNav from "@/components/layout/BottomNav";
import TopNav from "@/components/layout/TopNav";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className='flex flex-col flex-grow items-center justify-center h-full'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
        <p className='mt-4 text-muted-foreground'>Memuat data pengguna...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect,
    // but as a fallback, show loading or nothing.
    return null;
  }

  return (
    <div className='flex flex-col h-full'>
      <TopNav />
      <main className='flex-grow overflow-y-auto pb-20'>
        {/* pb-20 to make space for bottom nav, pt-4 for spacing from top nav */}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
