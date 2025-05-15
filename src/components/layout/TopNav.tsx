"use client";

import Link from 'next/link';
import { Menu, LogOut, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function TopNav() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathname === "/onboarding" || pathname === "/report1" || pathname === "/report" || pathname === "/report2") return null;

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full flex flex-col items-center bg-transparent">
        <div className="w-full max-w-[393px] h-[76px] bg-[#328E6E] backdrop-blur flex justify-between items-center px-4 rounded-b-2xl">
          <div className="flex flex-col">
            <span className="font-bold text-xl text-white leading-tight">{user?.email ? `Hello ${user.email}!` : 'Hello Yuyun!'}</span>
            {user && <span className="text-white text-sm font-normal">Welcome to Tanamind!</span>}
          </div>
          {!loading && user && (
            <Button variant="ghost" className="h-9 w-9 p-0" onClick={() => setIsMenuOpen(true)}>
              <Menu className="text-white h-6 w-6" />
            </Button>
          )}
        </div>
      </header>

      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)}>
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
