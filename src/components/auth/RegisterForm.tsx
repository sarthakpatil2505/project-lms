'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Github, Loader2, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});
type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const supabase = createClient();

  async function onSubmit(data: FormData) {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Check your email to confirm.');
      router.push('/login');
    }
  }

  async function signInWithOAuth(provider: 'google' | 'github') {
    setOauthLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  const inputClass = (hasError: boolean) => cn(
    'w-full px-4 py-3 rounded-xl bg-surface-hover border text-white placeholder-surface-muted',
    'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
    'transition-all duration-200 text-sm',
    hasError ? 'border-red-500/50' : 'border-surface-border'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-3xl font-bold text-white">Create account</h2>
        <p className="text-surface-muted mt-2">Join 50,000+ learners today</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(['google', 'github'] as const).map((provider) => (
          <button
            key={provider}
            onClick={() => signInWithOAuth(provider)}
            disabled={!!oauthLoading}
            className={cn(
              'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-surface-border capitalize',
              'bg-surface-hover hover:bg-surface-muted text-sm font-medium text-gray-300',
              'transition-all duration-200 hover:border-brand-500/50 disabled:opacity-50'
            )}
          >
            {oauthLoading === provider ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : provider === 'github' ? (
              <Github className="w-4 h-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            {provider}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-surface-border" />
        <span className="text-xs text-surface-muted uppercase tracking-wider">or with email</span>
        <div className="flex-1 h-px bg-surface-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input {...register('full_name')} placeholder="Jane Smith" className={cn(inputClass(!!errors.full_name), 'pl-10')} />
          </div>
          {errors.full_name && <p className="text-xs text-red-400">{errors.full_name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input {...register('email')} type="email" placeholder="you@example.com" className={cn(inputClass(!!errors.email), 'pl-10')} />
          </div>
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className={cn(inputClass(!!errors.password), 'pr-10')}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Confirm</label>
            <input type="password" {...register('confirm')} placeholder="••••••••" className={inputClass(!!errors.confirm)} />
            {errors.confirm && <p className="text-xs text-red-400">{errors.confirm.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-brand hover:opacity-90 active:scale-[0.98] transition-all duration-200 glow-brand-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-surface-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
      </p>
    </motion.div>
  );
}
