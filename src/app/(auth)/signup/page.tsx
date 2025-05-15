// src/app/(auth)/signup/page.tsx
import SignupForm from '@/components/auth/SignupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar - SawiKu',
  description: 'Buat akun baru SawiKu.',
};

export default function SignupPage() {
  return <SignupForm />;
}
