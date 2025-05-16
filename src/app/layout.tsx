import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Tanamind - Pertumbuhan Tanaman',
  description: 'Aplikasi untuk memantau dan mendapatkan saran pertumbuhan tanaman.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="flex justify-center bg-gray-100 dark:bg-neutral-900">
            <div className="w-full max-w-md min-h-screen bg-background shadow-2xl flex flex-col">
              {children}
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
