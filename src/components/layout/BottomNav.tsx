"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from "next/image";

const navItems = [
  { href: '/dashboard', label: 'Home', icon: <Home className="h-6 w-6" /> },
  {
    href: "/plants/add",
    icon: (
      <div className="relative flex flex-col items-center justify-center -mt-10 z-50">
        <button
          className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center border-4 border-[#A1DEC9] bg-[radial-gradient(circle,_#43BD92_0%,_#328E6E_100%)] translate-x-2"
        >
          <Image
            src="/assets/images/logoo.png"
            alt="Logo"
            width={70}
            height={70}
            className="rounded-full"
          />
        </button>
        <span className="text-xs mt-2 text-[#328E6E] translate-x-2">Add Plants</span>
      </div>
    ),
  },
  { href: '#', label: 'Notification', icon: <Bell className="h-6 w-6" /> },
];

export default function BottomNav() {
  const pathname = usePathname();

  // 👇 Jangan tampilkan jika sedang di halaman /onboarding
  if (pathname === "/onboarding") return null;

  return (
    <nav className="fixed bottom-1 left-0 right-0 h-20 border-t bg-background shadow-top z-40 max-w-md mx-auto">
      <div className="flex h-full items-center justify-between px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-[#328E6E]"
                  : "text-muted-foreground hover:text-[#328E6E]/80",
              )}
            >
              {item.icon}
              {item.href !== "/report" && (
                <span className="text-xs">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
