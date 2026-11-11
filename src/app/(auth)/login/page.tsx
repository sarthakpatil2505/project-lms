import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-surface-muted text-sm">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
