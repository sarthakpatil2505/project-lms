'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Sliders, 
  ExternalLink, 
  Send, 
  AlertCircle,
  Award,
  FileCode2,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  assignmentTitle: string;
  weekNumber: number;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late';
  testSuitePassed: string;
  currentScore: number | null;
  maxScore: number;
  feedback: string;
}

export function GradebookView() {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 'sub-1',
      studentName: 'Alex Mercer',
      studentEmail: 'alex.mercer@cs.mit.edu',
      assignmentTitle: 'Assignment 4: Raft in Go (Lab 2A)',
      weekNumber: 4,
      submittedAt: 'Today at 14:22 UTC',
      status: 'submitted',
      testSuitePassed: '10/10 passed',
      currentScore: null,
      maxScore: 100,
      feedback: '',
    },
    {
      id: 'sub-2',
      studentName: 'Samantha Wu',
      studentEmail: 'swu@stanford.edu',
      assignmentTitle: 'Assignment 4: Raft in Go (Lab 2A)',
      weekNumber: 4,
      submittedAt: 'Yesterday at 21:05 UTC',
      status: 'graded',
      testSuitePassed: '10/10 passed',
      currentScore: 98,
      maxScore: 100,
      feedback: 'Flawless randomized election timer implementation and zero race conditions under go test -race.',
    },
    {
      id: 'sub-3',
      studentName: 'Devon Vance',
      studentEmail: 'dvance@berkeley.edu',
      assignmentTitle: 'Assignment 4: Raft in Go (Lab 2A)',
      weekNumber: 4,
      submittedAt: 'Today at 02:14 UTC',
      status: 'submitted',
      testSuitePassed: '8/10 passed',
      currentScore: null,
      maxScore: 100,
      feedback: '',
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(95);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const handleOpenGradeDialog = (sub: Submission) => {
    setSelectedSubmission(sub);
    setGradeInput(sub.currentScore || 90);
    setFeedbackInput(sub.feedback || 'Great test suite passes. Clean Go concurrency handling.');
  };

  const handleSaveGrade = () => {
    if (!selectedSubmission) return;

    setSubmissions(
      submissions.map((s) =>
        s.id === selectedSubmission.id
          ? {
              ...s,
              status: 'graded',
              currentScore: gradeInput,
              feedback: feedbackInput,
            }
          : s
      )
    );

    toast.success(`Score ${gradeInput}/100 published. Recalculated Best-of-8 score!`);
    setSelectedSubmission(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono uppercase text-brand-400 font-bold">
          Evaluator / TA Assessment Portal
        </span>
        <h1 className="text-2xl font-extrabold text-white font-heading">
          Student Submissions Gradebook
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review automated test runs, inspect source archives, assign rubric marks, and sync Best-of-N final grades.
        </p>
      </div>

      {/* Submissions Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            Pending Evaluation Queue ({submissions.filter((s) => s.status !== 'graded').length} Pending)
          </span>
          <span className="text-xs text-slate-400 font-mono">Week 4 Assignments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Assignment</th>
                <th className="p-4">Automated Tests</th>
                <th className="p-4">Submitted At</th>
                <th className="p-4">Status</th>
                <th className="p-4">Score</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{sub.studentName}</div>
                    <div className="text-[11px] text-slate-400">{sub.studentEmail}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-300">{sub.assignmentTitle}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
                      <Check className="w-3 h-3" />
                      {sub.testSuitePassed}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{sub.submittedAt}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        sub.status === 'graded'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {sub.currentScore !== null ? `${sub.currentScore} / ${sub.maxScore}` : '—'}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenGradeDialog(sub)}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
                    >
                      {sub.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Dialog Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-brand-400 font-bold uppercase">
                  Grading Terminal
                </span>
                <h3 className="text-base font-bold text-white">
                  {selectedSubmission.studentName} &bull; {selectedSubmission.assignmentTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            {/* Test result status */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">CI Automated Evaluation:</span>
              <span className="text-emerald-400 font-bold">{selectedSubmission.testSuitePassed}</span>
            </div>

            {/* Score Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Awarded Points (out of 100):</span>
                <span className="font-mono text-brand-400 font-bold text-base">{gradeInput} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gradeInput}
                onChange={(e) => setGradeInput(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>

            {/* Feedback Textarea */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Instructor &amp; TA Feedback for Student
              </label>
              <textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGrade}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Score &amp; Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
