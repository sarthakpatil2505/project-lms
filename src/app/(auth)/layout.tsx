import { GraduationCap, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-card flex-col justify-between p-12">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-20 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/50 via-transparent to-violet-950/30" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center glow-brand-sm group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl gradient-text-brand">LearnHub</span>
          </Link>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-brand-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wider uppercase">Enterprise LMS</span>
          </div>
          <h1 className="font-heading text-5xl font-bold text-white leading-tight">
            Learn Without
            <span className="block gradient-text"> Boundaries</span>
          </h1>
          <p className="text-surface-muted text-lg leading-relaxed max-w-sm">
            World-class courses, weekly assignments, auto-graded quizzes, and verifiable certificates — all in one platform.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '50K+', label: 'Learners' },
              { value: '200+', label: 'Courses' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <div className="font-heading font-bold text-2xl gradient-text-brand">{stat.value}</div>
                <div className="text-xs text-surface-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 glass rounded-2xl p-6">
          <p className="text-sm text-gray-300 italic leading-relaxed">
            &ldquo;LearnHub transformed how our institution delivers education. The weekly assignment system and instant grading are game-changers.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white text-sm font-bold">DR</div>
            <div>
              <div className="text-sm font-medium text-white">Dr. Rajan Mehta</div>
              <div className="text-xs text-surface-muted">IIT Bombay, CS Dept.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
        <div className="absolute inset-0 bg-gradient-hero opacity-30 pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg gradient-text-brand">LearnHub</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
