'use client';

import { 
  Video, 
  Calendar, 
  CheckSquare, 
  Calculator, 
  FileCheck2, 
  MessageSquareCode, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Video,
      badge: 'Coursera Streaming',
      badgeColor: 'text-brand-400 bg-brand-950/60 border-brand-800/60',
      title: 'Smart Video Player with Position Sync',
      description:
        'Custom HLS streaming player with 0.5x to 2x speed controls, automatic progress bookmarking down to the second, interactive search-enabled transcripts, and auto-advance.',
    },
    {
      icon: Calendar,
      badge: 'NPTEL Rigor',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      title: 'Weekly Assignments & Hard Cutoffs',
      description:
        'Strict weekly assignment cadence. Real-time countdown clocks, PDF and code archive uploads, and zero tolerance for submissions past the hard cutoff timestamp.',
    },
    {
      icon: CheckSquare,
      badge: 'Instant Assessment',
      badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-800/60',
      title: 'Timed Quizzes & Exam Engine',
      description:
        'Anti-cheat timed MCQ engine with single and multi-select options, question jump palette, flag-for-review status, and auto-submit on countdown expiry.',
    },
    {
      icon: Calculator,
      badge: 'Scoring Algorithm',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      title: 'Best-of-N Automated Score Engine',
      description:
        'Database-level triggers compute your cumulative grade using your top X weekly scores (e.g., Best 8 of 12 weeks), giving students flexibility without compromising rigor.',
    },
    {
      icon: FileCheck2,
      badge: 'Accreditation',
      badgeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60',
      title: 'Dynamic PDF Certificates & QR Verification',
      description:
        'Instantly generated cryptographic PDF credentials upon achieving the passing threshold (>= 75%). Publicly verifiable via unique QR codes and immutable hashes.',
    },
    {
      icon: MessageSquareCode,
      badge: 'Peer Community',
      badgeColor: 'text-violet-400 bg-violet-950/60 border-violet-800/60',
      title: 'Threaded Forums with Verified Answers',
      description:
        'Dedicated discussion boards per module and week. Community upvotes, nested comments, and verified "Instructor Answered" badges powered by Supabase Realtime.',
    },
    {
      icon: ShieldCheck,
      badge: 'Security & RLS',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
      title: 'Granular Role-Based Access Control',
      description:
        'Strict Row Level Security (RLS) policies protecting 16 tables across Students, Instructors, Evaluators/TAs, and Platform Admins.',
    },
    {
      icon: Sparkles,
      badge: 'Examination',
      badgeColor: 'text-teal-400 bg-teal-950/60 border-teal-800/60',
      title: 'Proctored Exam Slot Booking & Hall Tickets',
      description:
        'Register for remote or center-based proctored examinations, generate customized digital hall tickets, and synchronize final exam scores directly with course grades.',
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-400 mb-3">
            System Architecture
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
            Engineered Beyond Coursera &amp; NPTEL
          </p>
          <p className="text-base sm:text-lg text-slate-300">
            We synthesized the UX elegance of modern streaming education with the academic discipline and grading integrity of national certification councils.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-brand-500/50 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-slate-800/80 text-white group-hover:bg-brand-600 transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${feat.badgeColor}`}
                    >
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
