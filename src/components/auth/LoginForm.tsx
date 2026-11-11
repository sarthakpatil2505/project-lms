'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Github, Loader2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const supabase = createClient();

  async function onSubmit(data: FormData) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
      router.push(redirectTo);
      router.refresh();
    }
  }

  async function signInWithOAuth(provider: 'google' | 'github') {
    setOauthLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (error) {
      toast.error(error.message);
      setOauthLoading(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-3xl font-bold text-white">Welcome back</h2>
        <p className="text-surface-muted mt-2">Sign in to continue learning</p>
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => signInWithOAuth('google')}
          disabled={!!oauthLoading}
          className={cn(
            'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-surface-border',
            'bg-surface-hover hover:bg-surface-muted text-sm font-medium text-gray-300',
            'transition-all duration-200 hover:border-brand-500/50',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {oauthLoading === 'google' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
              <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970244 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
              <path fill="#4A90D9" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
              <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
            </svg>
          )}
          Google
        </button>
        <button
          onClick={() => signInWithOAuth('github')}
          disabled={!!oauthLoading}
          className={cn(
            'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-surface-border',
            'bg-surface-hover hover:bg-surface-muted text-sm font-medium text-gray-300',
            'transition-all duration-200 hover:border-brand-500/50',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {oauthLoading === 'github' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Github className="w-4 h-4" />
          )}
          GitHub
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-surface-border" />
        <span className="text-xs text-surface-muted uppercase tracking-wider">or continue with email</span>
        <div className="flex-1 h-px bg-surface-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className={cn(
                'w-full pl-10 pr-4 py-3 rounded-xl bg-surface-hover border text-white placeholder-surface-muted',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
                'transition-all duration-200 text-sm',
                errors.email ? 'border-red-500/50' : 'border-surface-border'
              )}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className={cn(
                'w-full pl-4 pr-10 py-3 rounded-xl bg-surface-hover border text-white placeholder-surface-muted',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
                'transition-all duration-200 text-sm',
                errors.password ? 'border-red-500/50' : 'border-surface-border'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted hover:text-gray-300"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            'w-full py-3 px-4 rounded-xl font-semibold text-white text-sm',
            'bg-gradient-brand hover:opacity-90 active:scale-[0.98]',
            'transition-all duration-200 glow-brand-sm',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-2'
          )}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-surface-muted">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Create one free
        </Link>
      </p>
    </motion.div>
  );
}
