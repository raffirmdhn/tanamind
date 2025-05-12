"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from "next/image";

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  {
    href: "/report",
    label: "Add Plants",
    icon: () => (
      <div className="flex flex-col items-center justify-center">
        <button
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center border-4 border-[#A1DEC9] bg-[radial-gradient(circle,_#43BD92_0%,_#328E6E_100%)]"
        >
          <Image
            src="/assets/images/logoo.png"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </button>
      </div>
    ),
  },
  { href: '/onboarding', label: 'Notification', icon: Bell },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-1 left-0 right-0 h-15 border-t bg-background shadow-top z-40 max-w-md mx-auto rounded-t-xl">
      <div className="flex h-full items-center justify-between px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-primary/80",
            )}
          >
            {/* If item.icon is a component function (like the logo), render it without props */}
            {typeof item.icon === 'function' ? (
              <item.icon />
            ) : (
              <item.icon className="h-6 w-6" />
            )}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
