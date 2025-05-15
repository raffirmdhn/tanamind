"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from "next/image";

const navItems = [
  { href: '/dashboard', label: 'Home', icon: <Home className="h-6 w-6" /> },
  {
    href: "/report",
    label: "Add Plants",
    icon: (
      <div className="relative flex flex-col items-center justify-center -mt-10 z-50">
        <button
          className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center border-4 border-[#A1DEC9] bg-[radial-gradient(circle,_#43BD92_0%,_#328E6E_100%)]"
        >
          <Image
            src="/assets/images/logoo.png"
            alt="Logo"
            width={70}
            height={70}
            className="rounded-full"
          />
        </button>
        <span className="text-xs mt-2 text-[#328E6E]">Add Plants</span>
      </div>
    ),
  },
  { href: '/onboarding', label: 'Notification', icon: <Bell className="h-6 w-6" /> },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/onboarding" || pathname === "/report1" || pathname === "/report" || pathname === "/report2") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[108px] border-t bg-white shadow-inner z-40 w-full flex justify-center">
      <div className="flex h-full items-center justify-between px-6 w-full max-w-[393px] mx-auto">
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
