'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Video, 
  Layers, 
  Clock, 
  Calendar, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle,
  FileCode2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export function CourseStudio() {
  const [courses, setCourses] = useState([
    {
      id: 'c-1',
      title: 'Advanced Distributed Systems & Consensus',
      status: 'published',
      weeks: 12,
      students: 1420,
      bestOfN: 8,
    },
    {
      id: 'c-2',
      title: 'Full-Stack LLM Engineering & Agentic Systems',
      status: 'draft',
      weeks: 10,
      students: 0,
      bestOfN: 7,
    },
  ]);

  const [activeCourseId, setActiveCourseId] = useState('c-1');

  const [modules, setModules] = useState([
    {
      id: 'm-1',
      week: 1,
      title: 'Foundations of Distributed Systems & Clock Synchronization',
      lessonsCount: 3,
      hasAssignment: true,
      assignmentTitle: 'Assignment 1: Vector Clocks in Go',
      deadlineDays: 7,
    },
    {
      id: 'm-2',
      week: 2,
      title: 'State Machine Replication & Primary-Backup Systems',
      lessonsCount: 4,
      hasAssignment: true,
      assignmentTitle: 'Assignment 2: Fault-Tolerant Backup Service',
      deadlineDays: 14,
    },
    {
      id: 'm-3',
      week: 3,
      title: 'Classical Paxos: Single-Decree & Multi-Paxos',
      lessonsCount: 4,
      hasAssignment: true,
      assignmentTitle: 'Assignment 3: Multi-Paxos Protocol Implementation',
      deadlineDays: 21,
    },
    {
      id: 'm-4',
      week: 4,
      title: 'The Raft Consensus Algorithm',
      lessonsCount: 5,
      hasAssignment: true,
      assignmentTitle: 'Assignment 4: Raft Leader Election in Go (Lab 2A)',
      deadlineDays: 28,
    },
  ]);

  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) {
      toast.error('Please enter a module title');
      return;
    }

    const nextWeek = modules.length + 1;
    const newMod = {
      id: `m-${Date.now()}`,
      week: nextWeek,
      title: newModuleTitle,
      lessonsCount: 1,
      hasAssignment: !!newAssignmentTitle.trim(),
      assignmentTitle: newAssignmentTitle.trim() || `Assignment ${nextWeek}: Practical Implementation`,
      deadlineDays: nextWeek * 7,
    };

    setModules([...modules, newMod]);
    setNewModuleTitle('');
    setNewAssignmentTitle('');
    toast.success(`Week ${nextWeek} module created!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-brand-400 font-bold">
            Instructor Studio
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Course Curriculum &amp; Weekly Assignment Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build Coursera-grade modules and configure NPTEL rigid weekly assignment deadlines.
          </p>
        </div>

        <button
          onClick={() => toast.success('All course configuration changes saved to Supabase!')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          Save &amp; Publish Changes
        </button>
      </div>

      {/* Courses Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => setActiveCourseId(course.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              activeCourseId === course.id
                ? 'bg-slate-900 border-brand-500 ring-1 ring-brand-500'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{course.title}</h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    course.status === 'published'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {course.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {course.weeks} Weeks &bull; Best of {course.bestOfN} Scoring &bull;{' '}
                {course.students} Enrolled
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Builder Canvas */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            Curriculum Structure ({modules.length} Weeks Configured)
          </h2>
          <span className="text-xs font-mono text-slate-400">
            NPTEL Model: 1 Timed Quiz + 1 Assignment / Week
          </span>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-950 border border-brand-800 text-brand-400 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                  W{mod.week}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-brand-400" />
                      {mod.lessonsCount} Video Lessons
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                      {mod.assignmentTitle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => toast.success(`Editing Week ${mod.week} video lessons...`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Week
                </button>
                <button
                  onClick={() => {
                    setModules(modules.filter((m) => m.id !== mod.id));
                    toast.success(`Removed Week ${mod.week}`);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Week Form */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-dashed border-slate-700 space-y-4">
          <span className="text-xs font-bold uppercase text-brand-400 font-mono flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Append New Academic Week
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Module Topic Title
              </label>
              <input
                type="text"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="e.g. Byzantine Fault Tolerance & PBFT"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Weekly Graded Assignment Title
              </label>
              <input
                type="text"
                value={newAssignmentTitle}
                onChange={(e) => setNewAssignmentTitle(e.target.value)}
                placeholder="e.g. Assignment 5: PBFT Consensus Engine"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            onClick={handleAddModule}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-brand-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Week {modules.length + 1} to Curriculum
          </button>
        </div>
      </div>
    </div>
  );
}
