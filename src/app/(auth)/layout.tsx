// src/app/(auth)/layout.tsx
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col flex-grow items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {children}
    </div>
  );
}
