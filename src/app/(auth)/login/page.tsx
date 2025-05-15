// src/app/(auth)/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk - SawiKu',
  description: 'Masuk ke akun SawiKu Anda.',
};

export default function LoginPage() {
  return <LoginForm />;
}
