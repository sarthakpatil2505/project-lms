'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileCode2, 
  ShieldCheck, 
  Star, 
  Users, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CourseDetailProps {
  slug: string;
}

export function CourseDetailView({ slug }: CourseDetailProps) {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [openWeek, setOpenWeek] = useState<number | null>(1);

  // Demo Syllabus data reflecting Coursera structure + NPTEL weekly rigor
  const syllabus = [
    {
      week: 1,
      title: 'Foundations of Distributed Systems & Clock Synchronization',
      lessons: [
        { type: 'video', title: '1.1 Physical Clocks & Network Asynchrony', duration: '24m' },
        { type: 'video', title: '1.2 Lamport Timestamps & Vector Clocks', duration: '32m' },
        { type: 'quiz', title: 'Week 1 Timed Graded Quiz: Causal Ordering', duration: '30m' },
        { type: 'assignment', title: 'Assignment 1: Vector Clocks in Go', deadline: 'Hard Cutoff Sunday' },
      ],
    },
    {
      week: 2,
      title: 'State Machine Replication & Primary-Backup Systems',
      lessons: [
        { type: 'video', title: '2.1 State Machine Replication Concepts', duration: '28m' },
        { type: 'video', title: '2.2 Viewstamped Replication & Primary Backup', duration: '35m' },
        { type: 'quiz', title: 'Week 2 Timed Graded Quiz', duration: '25m' },
        { type: 'assignment', title: 'Assignment 2: Fault-Tolerant Primary-Backup Service', deadline: 'Hard Cutoff Sunday' },
      ],
    },
    {
      week: 3,
      title: 'Classical Paxos: Single-Decree & Multi-Paxos',
      lessons: [
        { type: 'video', title: '3.1 The Consensus Problem & FLP Impossibility', duration: '30m' },
        { type: 'video', title: '3.2 Single-Decree Paxos Proposer & Acceptor Protocol', duration: '45m' },
        { type: 'quiz', title: 'Week 3 Timed Graded Quiz: Paxos Invariants', duration: '30m' },
        { type: 'assignment', title: 'Assignment 3: Multi-Paxos Protocol Implementation', deadline: 'Hard Cutoff Sunday' },
      ],
    },
    {
      week: 4,
      title: 'The Raft Consensus Algorithm',
      lessons: [
        { type: 'video', title: '4.1 Raft Overview & Leader Election State Machine', duration: '34m' },
        { type: 'video', title: '4.2 Log Replication, Invariants & Safety Proofs', duration: '42m' },
        { type: 'quiz', title: 'Week 4 Timed Graded Quiz: Raft Safety', duration: '30m' },
        { type: 'assignment', title: 'Assignment 4: Raft Leader Election in Go (Lab 2A)', deadline: 'Hard Cutoff Sunday' },
      ],
    },
  ];

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      // Direct navigation to immersive learning room
      toast.success('Successfully enrolled! Loading learning room...');
      setTimeout(() => {
        router.push(`/course/${slug}/learn`);
      }, 700);
    } catch {
      toast.error('Failed to enroll. Please try again.');
      setIsEnrolling(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Course Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-950 text-brand-300 border border-brand-800 text-xs font-semibold">
              MIT CSAIL Curriculum
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-semibold">
              NPTEL Best-of-8 Rigor
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
            Advanced Distributed Systems &amp; Consensus
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            A comprehensive, rigorous graduate-level course covering consensus algorithms (Paxos, Raft), Byzantine fault tolerance, linearizability, distributed transactions, and cloud-scale storage engines.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9</span>
              <span className="text-slate-400 font-normal">(1,420 academic reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Users className="w-4 h-4 text-sky-400" />
              <span>14,200 students enrolled</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Passing: &gt;= 75%</span>
            </div>
          </div>

          {/* Instructor Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              AV
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dr. Alistair Vance</h4>
              <p className="text-xs text-slate-400">
                Principal Research Scientist, Distributed Systems Lab &bull; Former Chair at MIT CSAIL
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Floating Enrollment Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800 group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60"
              alt="Course trailer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Enrollment Fee:</span>
              <span className="text-white font-bold text-lg">Free (Academic Open Access)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Proctored Certification:</span>
              <span className="text-brand-300 font-semibold">Included</span>
            </div>
          </div>

          <button
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isEnrolling ? 'Loading Classroom...' : 'Enroll in Track Now'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>12 Weeks of HLS Video &amp; Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>NPTEL Best-of-8 Weekly Assignments</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Timed Auto-Graded Quizzes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verifiable Cryptographic Certificate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Evaluation & Grading Scheme (NPTEL Style Breakdown) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-400" />
          Official Academic Grading &amp; Certification Formula
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Following rigorous university accreditation standards, certification requires meeting both weekly assignment thresholds and final proctored examination marks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="text-xs font-mono uppercase text-brand-400 font-semibold">Weight: 25%</span>
            <h4 className="text-sm font-bold text-white mt-1">Best 8 of 12 Weekly Assignments</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Drop 4 lowest scoring weeks. Top 8 weeks are averaged to compute internal assessment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="text-xs font-mono uppercase text-sky-400 font-semibold">Weight: 75%</span>
            <h4 className="text-sm font-bold text-white mt-1">Final Proctored Examination</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              3-hour comprehensive proctored examination covering distributed algorithms &amp; proofs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">Threshold: &gt;= 75%</span>
            <h4 className="text-sm font-bold text-white mt-1">Accredited Certificate with QR</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Cryptographically signed PDF with unique certificate number and public verification link.
            </p>
          </div>
        </div>
      </div>

      {/* Syllabus Breakdown Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            Curriculum &amp; Weekly Syllabus
          </h3>
          <span className="text-xs text-slate-400 font-mono">12 Weeks Total</span>
        </div>

        <div className="space-y-3">
          {syllabus.map((item) => (
            <div
              key={item.week}
              className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenWeek(openWeek === item.week ? null : item.week)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-brand-400">
                    Week {item.week}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{item.title}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {item.lessons.length} lessons &bull; 1 Assignment
                  </span>
                  {openWeek === item.week ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {openWeek === item.week && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 divide-y divide-slate-800/40">
                  {item.lessons.map((lesson, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 flex items-center justify-between text-xs text-slate-300"
                    >
                      <div className="flex items-center gap-2.5">
                        {lesson.type === 'video' && <Play className="w-3.5 h-3.5 text-brand-400" />}
                        {lesson.type === 'quiz' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                        {lesson.type === 'assignment' && (
                          <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {lesson.duration || lesson.deadline}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
