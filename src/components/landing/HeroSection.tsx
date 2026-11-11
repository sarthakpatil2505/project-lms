'use client';

import Link from 'next/link';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-600/20 via-indigo-600/20 to-sky-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
            <span>Next-Gen Academic Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            <span className="text-slate-400">Coursera Usability &times; NPTEL Rigor</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-heading leading-[1.1] mb-6">
            Master Deep Tech with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-sky-400">
              Rigorous Weekly Mastery
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Immersive HLS video streaming, automated timed quizzes, weekly code submissions with rigid deadlines, and tamper-proof accredited certification.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Start Learning Now
              <Play className="w-4 h-4 fill-white" />
            </Link>
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all hover:border-slate-500 flex items-center justify-center gap-2"
            >
              Browse 50+ Curriculum Tracks
            </Link>
          </div>

          {/* Quick value badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto pt-6 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>NPTEL Best-of-8 Evaluation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Hard Cutoff Deadlines</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-brand-400 shrink-0" />
              <span>Verifiable QR Certificates</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
              <span>Proctored Exam Booking</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 p-1.5 ring-1 ring-slate-700/60 shadow-2xl shadow-indigo-950/50">
            {/* Window Header */}
            <div className="bg-slate-900/90 rounded-t-xl px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-mono ml-2">
                  course/distributed-systems/learn
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Syncing
                </span>
                <span>Week 4 of 12</span>
              </div>
            </div>

            {/* Video Player + Sidebar Layout Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 bg-slate-950 rounded-b-xl overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
              {/* Main Player Mockup */}
              <div className="lg:col-span-2 p-6 flex flex-col justify-between min-h-[340px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden group">
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                      Module 4 &bull; Consensus & Raft
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      Lesson 4.2: Raft Leader Election & Heartbeats
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">
                    1.25x Speed
                  </span>
                </div>

                {/* Big Center Play Circle */}
                <div className="my-8 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-2xl shadow-brand-500/40 cursor-pointer group-hover:scale-110 group-hover:bg-brand-500 transition-all duration-300">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                </div>

                {/* Video scrubber bar & duration */}
                <div className="relative z-10 space-y-2">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full w-[46%]" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>14:20 / 31:45</span>
                    <span className="text-brand-300">Auto-Save Progress Active</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Syllabus Mockup */}
              <div className="p-5 bg-slate-900/40 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-400" />
                      Weekly Syllabus
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">75% Complete</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800/90 border border-brand-500/40 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-medium truncate">4.1 Distributed State Machines</span>
                      </div>
                      <span className="text-slate-400 font-mono">18m</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-brand-600/20 border border-brand-500/50 flex items-center justify-between text-brand-200">
                      <div className="flex items-center gap-2.5">
                        <Play className="w-4 h-4 text-brand-400 fill-brand-400 shrink-0" />
                        <span className="font-semibold truncate">4.2 Raft Leader Election</span>
                      </div>
                      <span className="text-brand-300 font-mono">31m</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">Week 4 Timed Graded Quiz</span>
                      </div>
                      <span className="text-amber-300 font-mono font-medium">30m &bull; Auto</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="truncate">Assignment 4: Raft in Go</span>
                      </div>
                      <span className="text-rose-400 font-mono font-medium">Due in 2d</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Current Best 8 Score:</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">91.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
