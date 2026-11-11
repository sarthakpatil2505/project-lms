'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  BookOpen, 
  Award, 
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  headline: string;
  instructor: string;
  institution: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  weeks: number;
  hours: number;
  passingScore: number;
  rating: number;
  enrolledStudents: number;
  thumbnail: string;
  tags: string[];
}

const ALL_COURSES: CourseItem[] = [
  {
    id: 'c-1',
    slug: 'distributed-systems',
    title: 'Advanced Distributed Systems & Consensus',
    headline: 'Master Paxos, Raft, Byzantine fault tolerance, and vector clocks with real Go implementations.',
    instructor: 'Dr. Alistair Vance',
    institution: 'MIT CSAIL',
    category: 'Computer Science',
    difficulty: 'Advanced',
    weeks: 12,
    hours: 48,
    passingScore: 75,
    rating: 4.9,
    enrolledStudents: 14200,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
    tags: ['Distributed Systems', 'Go', 'Raft', 'Consensus'],
  },
  {
    id: 'c-2',
    slug: 'llm-engineering',
    title: 'Full-Stack LLM Engineering & Agentic Systems',
    headline: 'Build multi-agent frameworks, production RAG pipelines, fine-tuning, and evaluation harnesses.',
    instructor: 'Prof. Elena Rostova',
    institution: 'Stanford AI Lab',
    category: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    weeks: 10,
    hours: 40,
    passingScore: 75,
    rating: 4.95,
    enrolledStudents: 28500,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    tags: ['AI Agents', 'RAG', 'PyTorch', 'LangChain'],
  },
  {
    id: 'c-3',
    slug: 'operating-systems-kernel',
    title: 'Operating Systems: Kernel Architecture & Memory',
    headline: 'Deep dive into virtual memory management, interrupt handling, preemptive scheduling, and POSIX.',
    instructor: 'Dr. Marcus Thorne',
    institution: 'IIT Madras',
    category: 'Computer Science',
    difficulty: 'Advanced',
    weeks: 12,
    hours: 60,
    passingScore: 80,
    rating: 4.88,
    enrolledStudents: 9700,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    tags: ['Kernel', 'C', 'Virtual Memory', 'Operating Systems'],
  },
  {
    id: 'c-4',
    slug: 'applied-cryptography',
    title: 'Applied Cryptography & Zero-Knowledge Proofs',
    headline: 'Elliptic curves, zk-SNARKs, Post-Quantum lattice primitives, and homomorphic encryption in Rust.',
    instructor: 'Dr. Sarah Chen',
    institution: 'UC Berkeley',
    category: 'Cybersecurity',
    difficulty: 'Advanced',
    weeks: 8,
    hours: 36,
    passingScore: 75,
    rating: 4.92,
    enrolledStudents: 7400,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60',
    tags: ['Cryptography', 'ZKP', 'Rust', 'Security'],
  },
  {
    id: 'c-5',
    slug: 'high-performance-computing',
    title: 'High-Performance Computing & GPU Acceleration',
    headline: 'CUDA programming, MPI distributed clusters, OpenMP threading, and SIMD pipeline optimization.',
    instructor: 'Prof. David Lin',
    institution: 'Carnegie Mellon',
    category: 'Computer Science',
    difficulty: 'Intermediate',
    weeks: 10,
    hours: 45,
    passingScore: 70,
    rating: 4.85,
    enrolledStudents: 11200,
    thumbnail: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=60',
    tags: ['CUDA', 'MPI', 'C++', 'Parallel Computing'],
  },
  {
    id: 'c-6',
    slug: 'scalable-microservices',
    title: 'Cloud Native Microservices & Kubernetes',
    headline: 'Event-driven architectures, Kafka streaming, gRPC protocols, and production Kubernetes deployment.',
    instructor: 'Lisa Patel',
    institution: 'Cloud Native Foundation',
    category: 'Software Engineering',
    difficulty: 'Beginner',
    weeks: 8,
    hours: 32,
    passingScore: 70,
    rating: 4.89,
    enrolledStudents: 19800,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    tags: ['Kubernetes', 'Docker', 'gRPC', 'Kafka'],
  },
];

const CATEGORIES = ['All', 'Computer Science', 'Artificial Intelligence', 'Cybersecurity', 'Software Engineering'];
const DIFFICULTIES = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');

  const filteredCourses = ALL_COURSES.filter((course) => {
    const matchesQuery =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'All Levels' || course.difficulty === selectedDifficulty;

    return matchesQuery && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-10">
      {/* Search & Filter Header */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-slate-950 border border-slate-800 p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900/60 text-brand-300 text-xs font-semibold mb-3 border border-brand-700/50">
            <Sparkles className="w-3.5 h-3.5" />
            Accredited Academic Catalog
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Explore Rigorous University Curriculums
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Weekly assignments, proctored examinations, Best-of-N grading algorithms, and verifiable certifications.
          </p>
        </div>

        {/* Search input */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, technology (e.g. Raft, PyTorch, C, CUDA)..."
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">
            Showing <strong className="text-white">{filteredCourses.length}</strong> courses
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-brand-950/40 hover:-translate-y-1"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-[11px] font-semibold text-slate-200 backdrop-blur-md border border-slate-700">
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-white">{course.institution}</span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400 font-normal">
                        ({course.enrolledStudents.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {course.headline}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-300 mb-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-brand-400" />
                      <span>{course.weeks} Wks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{course.hours} Hrs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Pass: {course.passingScore}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
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

              {/* Action */}
              <div className="p-6 pt-0 border-t border-slate-800/80 mt-2">
                <Link
                  href={`/courses/${course.slug}`}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-brand-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  View Syllabus &amp; Enroll
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
