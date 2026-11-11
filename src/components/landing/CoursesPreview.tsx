'use client';

import Link from 'next/link';
import { Clock, BookOpen, Star, ArrowRight, Award } from 'lucide-react';

export function CoursesPreview() {
  const featuredCourses = [
    {
      id: 'cs-distributed-systems',
      title: 'Advanced Distributed Systems & Consensus',
      slug: 'distributed-systems',
      instructor: 'Dr. Alistair Vance',
      institution: 'MIT CSAIL',
      weeks: 12,
      hours: 48,
      difficulty: 'Advanced',
      passingGrade: 75,
      rating: 4.9,
      reviewsCount: 1420,
      tags: ['Raft', 'Paxos', 'Go', 'Fault-Tolerance'],
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
    },
    {
      id: 'ai-large-language-models',
      title: 'Full-Stack LLM Engineering & Agentic Systems',
      slug: 'llm-engineering',
      instructor: 'Prof. Elena Rostova',
      institution: 'Stanford AI Lab',
      weeks: 10,
      hours: 40,
      difficulty: 'Intermediate',
      passingGrade: 75,
      rating: 4.95,
      reviewsCount: 2850,
      tags: ['Transformers', 'PyTorch', 'RAG', 'LangChain'],
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    },
    {
      id: 'cs-operating-systems-kernel',
      title: 'Operating Systems: Kernel Architecture & Memory',
      slug: 'operating-systems-kernel',
      instructor: 'Dr. Marcus Thorne',
      institution: 'IIT Madras',
      weeks: 12,
      hours: 60,
      difficulty: 'Advanced',
      passingGrade: 80,
      rating: 4.88,
      reviewsCount: 970,
      tags: ['Linux Kernel', 'C', 'Virtual Memory', 'Scheduling'],
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    },
  ];

  return (
    <section className="py-24 bg-slate-900/30 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-400">
              Curriculum Tracks
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-1">
              Accredited University Tracks
            </h2>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 mt-4 md:mt-0 group"
          >
            View all 50+ courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-brand-950/40 hover:-translate-y-1"
            >
              <div>
                {/* Image & tags */}
                <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-xs font-semibold text-slate-200 backdrop-blur-md border border-slate-700">
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-white">{course.institution}</span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Instructor: {course.instructor}</p>

                  {/* Meta items */}
                  <div className="flex items-center gap-4 text-xs text-slate-300 mb-5 font-mono">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-brand-400" />
                      <span>{course.weeks} Weeks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{course.hours} Hours</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Pass: {course.passingGrade}%</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {course.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <div className="p-6 pt-0 border-t border-slate-800/80 mt-2">
                <Link
                  href={`/courses/${course.slug}`}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-brand-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  View Syllabus &amp; Enroll
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
