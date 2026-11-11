'use client';

import { Users, Award, CheckCircle, Flame } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      label: 'Average Course Completion',
      value: '84.6%',
      subtext: 'vs 12% industry baseline via NPTEL weekly cadence',
      icon: Award,
      color: 'text-brand-400',
    },
    {
      label: 'Verified Certificates Issued',
      value: '142,000+',
      subtext: 'Cryptographically signed & verifiable via QR',
      icon: CheckCircle,
      color: 'text-emerald-400',
    },
    {
      label: 'Active Engineering Students',
      value: '500,000+',
      subtext: 'Across top tier global engineering universities',
      icon: Users,
      color: 'text-sky-400',
    },
    {
      label: 'Weekly Assignment Submissions',
      value: '3.8M+',
      subtext: 'Graded with automated test suites & rubrics',
      icon: Flame,
      color: 'text-amber-400',
    },
  ];

  return (
    <section className="py-16 bg-slate-900/50 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-slate-800/80 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-500 uppercase">
                    Verified Metric
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-200 mb-1">{stat.label}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{stat.subtext}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
