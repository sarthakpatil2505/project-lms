'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  Clock, 
  FileCode2, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Calendar,
  X
} from 'lucide-react';
import { usePlayerStore } from '@/stores/usePlayerStore';

export interface ModuleItem {
  id: string;
  weekNumber: number;
  title: string;
  isLocked: boolean;
  lessons: {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz' | 'assignment';
    duration: string;
    isCompleted: boolean;
  }[];
  assignment?: {
    id: string;
    title: string;
    deadline: string;
    isSubmitted: boolean;
  };
}

interface SidebarProps {
  courseSlug: string;
  courseTitle: string;
  modules: ModuleItem[];
  activeLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  onCloseMobile?: () => void;
}

export function LessonSidebar({
  courseSlug,
  courseTitle,
  modules,
  activeLessonId,
  onSelectLesson,
  onCloseMobile,
}: SidebarProps) {
  const [openWeek, setOpenWeek] = useState<number>(1);
  const { isSidebarOpen } = usePlayerStore();

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shrink-0 select-none z-20">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400 font-bold">
            Course Track
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{courseTitle}</h2>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-3 space-y-3">
        {modules.map((mod) => {
          const isOpen = openWeek === mod.weekNumber;
          const completedCount = mod.lessons.filter((l) => l.isCompleted).length;

          return (
            <div
              key={mod.id}
              className={`rounded-xl border overflow-hidden transition-all ${
                mod.isLocked
                  ? 'bg-slate-950/40 border-slate-800/40 opacity-75'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              {/* Module Header Accordion */}
              <button
                onClick={() => !mod.isLocked && setOpenWeek(isOpen ? 0 : mod.weekNumber)}
                disabled={mod.isLocked}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {mod.isLocked ? (
                    <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <Layers className="w-4 h-4 text-brand-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      Week {mod.weekNumber}
                    </span>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{mod.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {completedCount}/{mod.lessons.length}
                  </span>
                  {!mod.isLocked && (
                    isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )
                  )}
                </div>
              </button>

              {/* Module Lessons */}
              {isOpen && !mod.isLocked && (
                <div className="p-2 space-y-1 border-t border-slate-800/80 bg-slate-900/40">
                  {mod.lessons.map((lesson) => {
                    const isActive = activeLessonId === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between text-xs transition-all ${
                          isActive
                            ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/30'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {lesson.isCompleted ? (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? 'text-white' : 'text-emerald-400'
                              }`}
                            />
                          ) : lesson.type === 'video' ? (
                            <Play className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono shrink-0 ml-2 ${
                            isActive ? 'text-brand-100' : 'text-slate-500'
                          }`}
                        >
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}

                  {/* NPTEL-style Weekly Assignment & Quiz Buttons */}
                  <div className="pt-2 border-t border-slate-800/60 mt-2 space-y-1.5">
                    <Link
                      href={`/course/${courseSlug}/quiz/quiz-w${mod.weekNumber}`}
                      className="w-full p-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 flex items-center justify-between text-amber-300 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-semibold">Week {mod.weekNumber} Timed Quiz</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-900/80">
                        Auto-Graded
                      </span>
                    </Link>

                    {mod.assignment && (
                      <Link
                        href={`/course/${courseSlug}/assignment/${mod.assignment.id}`}
                        className="w-full p-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/50 flex items-center justify-between text-indigo-300 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-semibold">{mod.assignment.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-rose-400">
                          {mod.assignment.deadline}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Course Progress */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-xs">
        <div className="flex items-center justify-between text-slate-300 mb-1.5 font-mono">
          <span>Overall Course Progress</span>
          <span className="font-bold text-white">68%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-brand-500 w-[68%]" />
        </div>
      </div>
    </aside>
  );
}
