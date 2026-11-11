'use client';

import Link from 'next/link';
import { 
  Play, 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp,
  FileText,
  ShieldCheck
} from 'lucide-react';

interface EnrolledCourse {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  instructorName: string;
  progressPercent: number;
  currentLessonTitle: string;
  currentLessonId: string;
  nextAssignmentDue: string;
  bestOfNScore: number;
  passingThreshold: number;
  thumbnailUrl: string;
}

interface PendingAssignment {
  id: string;
  courseTitle: string;
  courseSlug: string;
  title: string;
  weekNumber: number;
  deadline: string;
  hoursLeft: number;
  isHardCutoff: boolean;
  type: string;
}

export function StudentDashboard() {
  // Demo enriched state showcasing Coursera + NPTEL hybrid features
  const enrolledCourses: EnrolledCourse[] = [
    {
      id: 'enr-1',
      courseId: 'c-1',
      title: 'Advanced Distributed Systems & Consensus',
      slug: 'distributed-systems',
      instructorName: 'Dr. Alistair Vance (MIT CSAIL)',
      progressPercent: 68,
      currentLessonTitle: 'Lesson 4.2: Raft Leader Election & Heartbeats',
      currentLessonId: 'les-4-2',
      nextAssignmentDue: 'Tomorrow, 11:59 PM',
      bestOfNScore: 88.5,
      passingThreshold: 75,
      thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'enr-2',
      courseId: 'c-2',
      title: 'Full-Stack LLM Engineering & Agentic Systems',
      slug: 'llm-engineering',
      instructorName: 'Prof. Elena Rostova (Stanford AI)',
      progressPercent: 42,
      currentLessonTitle: 'Lesson 3.1: Vector DB Indexing & Hybrid Search',
      currentLessonId: 'les-3-1',
      nextAssignmentDue: 'In 4 days',
      bestOfNScore: 92.0,
      passingThreshold: 75,
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60',
    },
  ];

  const pendingAssignments: PendingAssignment[] = [
    {
      id: 'assign-w4',
      courseTitle: 'Advanced Distributed Systems',
      courseSlug: 'distributed-systems',
      title: 'Week 4: Raft Leader Election Implementation',
      weekNumber: 4,
      deadline: 'Tomorrow at 23:59 UTC',
      hoursLeft: 26,
      isHardCutoff: true,
      type: 'Code Submission (Go)',
    },
    {
      id: 'quiz-w3',
      courseTitle: 'Full-Stack LLM Engineering',
      courseSlug: 'llm-engineering',
      title: 'Week 3: Vector Embeddings & Similarity Metrics',
      weekNumber: 3,
      deadline: 'Nov 12 at 23:59 UTC',
      hoursLeft: 74,
      isHardCutoff: false,
      type: 'Timed MCQ Quiz (30 mins)',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900/40 via-indigo-900/30 to-slate-900 border border-brand-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
            Student Academic Terminal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading mt-1">
            Welcome back, Alex. Keep up your streak!
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
            You are enrolled in 2 courses with a current Best-of-8 average of{' '}
            <span className="text-emerald-400 font-bold">90.2%</span>. Raft assignment deadline is in 26 hours.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/course/distributed-systems/learn"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Resume: Raft Leader Election
            </Link>
            <Link
              href="/dashboard/assignments"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              View Deadlines (2 pending)
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Left: Active Courses, Right: NPTEL Deadlines & Best-of-N */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              My Active Enrolled Courses
            </h2>
            <Link
              href="/courses"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              Browse more <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                {/* Course Thumbnail + Info */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-slate-700">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white hover:text-brand-400 transition-colors">
                      <Link href={`/course/${course.slug}/learn`}>{course.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{course.instructorName}</p>
                    <p className="text-xs text-brand-300 font-medium mt-2 flex items-center gap-1.5">
                      <Play className="w-3 h-3 fill-brand-300" />
                      {course.currentLessonTitle}
                    </p>
                  </div>
                </div>

                {/* Progress & Actions */}
                <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Course Progress</span>
                    <span className="text-white font-mono font-bold">{course.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
                    <span>Best-8: <strong className="text-emerald-400">{course.bestOfNScore}%</strong></span>
                    <span>Pass: {course.passingThreshold}%</span>
                  </div>
                  <Link
                    href={`/course/${course.slug}/learn`}
                    className="w-full mt-2 py-2 rounded-lg bg-slate-800 hover:bg-brand-600 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    Continue Learning
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Proctored Exam Booking Banner (NPTEL feature) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 to-slate-900 border border-sky-800/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sky-900/60 text-sky-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">NPTEL-Style Proctored Final Exam</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Exam registration slot open for Dec 15 cycle. Hall ticket generates automatically.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/exams"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shrink-0"
            >
              Register Slot
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Urgent Deadlines & Best-of-N Engine */}
        <div className="space-y-6">
          {/* Urgent Deadlines (NPTEL Rigid Cadence) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Urgent Weekly Deadlines
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-semibold">
                Hard Cutoffs
              </span>
            </div>

            <div className="space-y-3">
              {pendingAssignments.map((assign) => (
                <div
                  key={assign.id}
                  className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-brand-400 font-semibold">
                        {assign.courseTitle}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{assign.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">{assign.type}</span>
                    <span className="text-amber-400 font-mono font-bold flex items-center gap-1 text-[11px]">
                      <AlertCircle className="w-3 h-3" />
                      {assign.hoursLeft}h left
                    </span>
                  </div>
                  <Link
                    href={`/course/${assign.courseSlug}/assignment/${assign.id}`}
                    className="block w-full text-center py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Submit Assignment Now
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Best of N Score Engine Simulator (NPTEL Algorithm) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Best 8 of 12 Weeks Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your final grade drops the 4 lowest assignment scores. Only the top 8 weekly assignments count towards your accredited certificate.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Current Best-8 Mean:
                </span>
                <span className="font-mono font-bold text-sm">88.5%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 text-slate-300">
                <span>Passing Requirement:</span>
                <span className="font-mono font-bold">&gt;= 75.0%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 text-slate-300">
                <span>Certificate Status:</span>
                <span className="text-emerald-400 font-bold font-mono">ON TRACK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
