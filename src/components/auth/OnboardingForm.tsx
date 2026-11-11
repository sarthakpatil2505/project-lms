'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Briefcase, GraduationCap, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

const schema = z.object({
  full_name: z.string().min(2, 'Name required'),
  bio: z.string().max(300, 'Max 300 characters').optional(),
  role: z.enum(['student', 'instructor']),
});
type FormData = z.infer<typeof schema>;

const ROLES: { value: 'student' | 'instructor'; label: string; desc: string; icon: React.ElementType }[] = [
  { value: 'student', label: 'Student', desc: 'Enroll in courses, complete assignments, earn certificates', icon: GraduationCap },
  { value: 'instructor', label: 'Instructor', desc: 'Create courses, build quizzes, track student progress', icon: Briefcase },
];

export function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  });

  const selectedRole = watch('role');

  async function onSubmit(data: FormData) {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email!,
      full_name: data.full_name,
      bio: data.bio || null,
      role: data.role as UserRole,
    });

    setLoading(false);
    if (error) {
      toast.error('Could not save profile');
    } else {
      toast.success('Profile set up! Welcome to LearnHub 🎉');
      router.push(data.role === 'instructor' ? '/instructor' : '/dashboard');
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h2 className="font-heading text-3xl font-bold text-white">Set up your profile</h2>
        <p className="text-surface-muted mt-2">Just a few details to personalise your experience</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Full Name</label>
          <input
            {...register('full_name')}
            placeholder="Jane Smith"
            className="w-full px-4 py-3 rounded-xl bg-surface-hover border border-surface-border text-white placeholder-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm"
          />
          {errors.full_name && <p className="text-xs text-red-400">{errors.full_name.message}</p>}
        </div>

        {/* Role selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">I want to...</label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(({ value, label, desc, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('role', value)}
                className={cn(
                  'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                  selectedRole === value
                    ? 'border-brand-500 bg-brand-500/10 glow-brand-sm'
                    : 'border-surface-border bg-surface-hover hover:border-brand-500/40'
                )}
              >
                {selectedRole === value && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-500" />
                )}
                <Icon className={cn('w-5 h-5 mb-2', selectedRole === value ? 'text-brand-400' : 'text-surface-muted')} />
                <div className={cn('font-semibold text-sm', selectedRole === value ? 'text-white' : 'text-gray-400')}>{label}</div>
                <div className="text-xs text-surface-muted mt-1 leading-relaxed">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Bio <span className="text-surface-muted">(optional)</span></label>
          <textarea
            {...register('bio')}
            rows={3}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-3 rounded-xl bg-surface-hover border border-surface-border text-white placeholder-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-brand hover:opacity-90 active:scale-[0.98] transition-all glow-brand-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
          Let&apos;s Go!
        </button>
      </form>
    </motion.div>
  );
}
