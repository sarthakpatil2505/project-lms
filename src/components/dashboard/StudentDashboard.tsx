'use client';

import Link from 'next/link';
import {
  Play, Clock, Calendar, Award, CheckCircle2, AlertCircle,
  ArrowRight, TrendingUp, FileText, ShieldCheck, BookOpen, User
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
}

interface Enrollment {
  id: string;
  status: string;
  progress_percentage: number;
  final_calculated_score: number;
  enrolled_at: string;
  courses: {
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string;
    passing_grade_percent: number;
    profiles: { full_name: string };
  };
  lessons: { id: string; title: string } | null;
}

interface DashboardProps {
  user: Profile;
  enrollments: Enrollment[];
}

export function StudentDashboard({ user, enrollments }: DashboardProps) {
  const firstName = user.full_name?.split(' ')[0] ?? 'Learner';

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-8 px-4">
      {/* Welcome Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/40 flex items-center justify-center">
              <User className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-surface-muted">
                {user.role ?? 'student'} workspace
              </p>
              <h1 className="text-2xl font-extrabold text-white font-heading">
                Welcome back, {firstName}
              </h1>
            </div>
          </div>
          <p className="text-sm text-surface-muted ml-13">
            {user.email}
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          Browse Courses
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled Courses', value: enrollments.length, icon: BookOpen, color: 'brand' },
          { label: 'Completed', value: enrollments.filter(e => e.progress_percentage === 100).length, icon: CheckCircle2, color: 'emerald' },
          { label: 'In Progress', value: enrollments.filter(e => e.progress_percentage > 0 && e.progress_percentage < 100).length, icon: TrendingUp, color: 'amber' },
          { label: 'Certificates', value: 0, icon: Award, color: 'violet' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-brand-400" />
              <span className="text-xs text-surface-muted font-medium">{stat.label}</span>
            </div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-brand-400" />
          Your Enrolled Courses
        </h2>

        {enrollments.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No courses yet</h3>
            <p className="text-surface-muted text-sm mb-6">
              Browse the catalog and enroll in a course to get started.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-all"
            >
              Explore Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-brand-500/50 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative h-36 bg-slate-800 overflow-hidden">
                  {enrollment.courses?.thumbnail_url ? (
                    <img
                      src={enrollment.courses.thumbnail_url}
                      alt={enrollment.courses.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-900 to-slate-900 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-brand-500/50" />
                    </div>
                  )}
                  {/* Progress overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-900/80">
                    <div
                      className="h-full bg-brand-500 transition-all"
                      style={{ width: `${enrollment.progress_percentage}%` }}
                    />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-brand-300 transition-colors">
                      {enrollment.courses?.title}
                    </h3>
                    <span className="shrink-0 text-xs font-bold text-brand-400">
                      {Math.round(enrollment.progress_percentage)}%
                    </span>
                  </div>
                  <p className="text-xs text-surface-muted mb-3">
                    {enrollment.courses?.profiles?.full_name}
                  </p>

                  {enrollment.lessons && (
                    <p className="text-xs text-slate-400 mb-3 flex items-start gap-1.5">
                      <Play className="w-3 h-3 mt-0.5 shrink-0 text-brand-400" />
                      <span className="line-clamp-1">Up next: {enrollment.lessons.title}</span>
                    </p>
                  )}

                  {/* Score badge */}
                  {enrollment.final_calculated_score > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-semibold">
                        Best-of-N Score: {enrollment.final_calculated_score.toFixed(1)}%
                      </span>
                      {enrollment.final_calculated_score >= (enrollment.courses?.passing_grade_percent ?? 75) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                  )}

                  <Link
                    href={`/course/${enrollment.courses?.slug}/learn`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-md shadow-brand-600/20 w-full justify-center"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
