'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Upload, 
  FileCode2, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ShieldCheck, 
  FileText, 
  Download,
  Terminal,
  Send,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AssignmentRoomProps {
  courseSlug: string;
  assignmentId: string;
}

export function AssignmentSubmissionRoom({
  courseSlug,
  assignmentId,
}: AssignmentRoomProps) {
  const [submissionTab, setSubmissionTab] = useState<'upload' | 'code' | 'text'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [codeContent, setCodeContent] = useState<string>(`package raft

// Raft consensus implementation in Go
// Lab 2A: Leader election & Heartbeats

type RequestVoteArgs struct {
    Term         int
    CandidateId  int
    LastLogIndex int
    LastLogTerm  int
}

type RequestVoteReply struct {
    Term        int
    VoteGranted bool
}

func (rf *Raft) RequestVote(args *RequestVoteArgs, reply *RequestVoteReply) {
    rf.mu.Lock()
    defer rf.mu.Unlock()

    if args.Term > rf.currentTerm {
        rf.currentTerm = args.Term
        rf.state = StateFollower
        rf.votedFor = -1
    }

    if args.Term == rf.currentTerm && 
       (rf.votedFor == -1 || rf.votedFor == args.CandidateId) &&
       rf.isUpToDate(args.LastLogIndex, args.LastLogTerm) {
        rf.votedFor = args.CandidateId
        reply.VoteGranted = true
        rf.resetElectionTimer()
    } else {
        reply.VoteGranted = false
    }
}
`);
  const [textSummary, setTextSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    submittedAt: string;
    hash: string;
    fileName: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        toast.error('File exceeds 25MB maximum limit.');
        return;
      }
      setSelectedFile(file);
      toast.success(`Attached ${file.name}`);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate cryptographic verification and Supabase submission storage
      await new Promise((r) => setTimeout(r, 1200));

      const fakeHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setSubmittedReceipt({
        submittedAt: new Date().toISOString(),
        hash: fakeHash,
        fileName: selectedFile ? selectedFile.name : 'raft_consensus_submission.go',
      });

      toast.success('Assignment submitted on time! Cryptographic receipt generated.');
    } catch {
      toast.error('Submission failed. Please check network connectivity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back and Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={`/course/${courseSlug}/learn`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Classroom
        </Link>
        <span className="text-xs font-mono text-brand-400 font-bold uppercase">
          Assignment 4 &bull; Distributed Systems
        </span>
      </div>

      {/* Hero Header with Rigid Deadline Countdown (NPTEL Feature) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold font-mono">
              Rigid Deadline &bull; Hard Cutoff
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              Max Score: 100 Points
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Week 4 Lab: Raft Leader Election &amp; Heartbeats
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Implement 2A leader election, RequestVote RPC, randomized timers, and log safety in Go.
          </p>
        </div>

        {/* Real-time Deadline Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-600/40 text-center shrink-0">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Time Remaining
          </span>
          <div className="text-2xl font-mono font-extrabold text-white mt-1">
            01d : 02h : 38m : 14s
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Due Sunday at 23:59 UTC</p>
        </div>
      </div>

      {/* Main Grid: Submission Studio (Left 2 cols) & Grading Rubric (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Submission Studio */}
        <div className="lg:col-span-2 space-y-6">
          {submittedReceipt ? (
            /* Submission Success Receipt */
            <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-600/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Submission Successfully Logged</h3>
                  <p className="text-xs text-slate-400">Timestamped before rigid deadline cutoff.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span>File:</span>
                  <span className="text-white font-bold">{submittedReceipt.fileName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Submission Time:</span>
                  <span className="text-emerald-400">{submittedReceipt.submittedAt}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 pt-2 border-t border-slate-800">
                  <span>Integrity Hash:</span>
                  <span className="text-brand-300 text-[11px] truncate max-w-xs">{submittedReceipt.hash}</span>
                </div>
              </div>

              <button
                onClick={() => setSubmittedReceipt(null)}
                className="text-xs font-semibold text-brand-400 hover:underline"
              >
                Upload updated version before deadline cutoff
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              {/* Tabs: File Upload vs Inline Code vs Rich Text */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                <button
                  onClick={() => setSubmissionTab('upload')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    submissionTab === 'upload'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  ZIP / Tar / PDF Upload
                </button>

                <button
                  onClick={() => setSubmissionTab('code')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    submissionTab === 'code'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Inline Code Editor
                </button>

                <button
                  onClick={() => setSubmissionTab('text')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    submissionTab === 'text'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Technical Writeup
                </button>
              </div>

              {/* Mode 1: File Upload */}
              {submissionTab === 'upload' && (
                <div className="space-y-4">
                  <label className="border-2 border-dashed border-slate-700 hover:border-brand-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-950/40 group">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".zip,.tar.gz,.pdf,.go,.rs"
                    />
                    <div className="p-4 rounded-full bg-slate-800 group-hover:bg-brand-600 text-slate-400 group-hover:text-white transition-colors mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-white">
                      {selectedFile ? selectedFile.name : 'Click to select or drag and drop files'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Allowed extensions: .zip, .tar.gz, .pdf, .go (Max: 25MB)
                    </span>
                  </label>
                </div>
              )}

              {/* Mode 2: Code Editor */}
              {submissionTab === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono">raft_consensus.go</span>
                    <span className="font-mono">Go 1.22+</span>
                  </div>
                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    rows={14}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-brand-500 leading-relaxed"
                  />
                </div>
              )}

              {/* Mode 3: Technical Writeup */}
              {submissionTab === 'text' && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-300">
                    Design choices, concurrency benchmarks &amp; bug fixes:
                  </span>
                  <textarea
                    value={textSummary}
                    onChange={(e) => setTextSummary(e.target.value)}
                    placeholder="Describe your solution architecture..."
                    rows={8}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-brand-500 leading-relaxed"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Late submissions penalized 10% per hour past cutoff
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105"
                >
                  {isSubmitting ? 'Verifying & Submitting...' : 'Submit Assignment'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: TA Grading Rubric & Instructions */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Automated Grading Rubric
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Leader Election Test 2A</span>
                  <span className="font-mono text-brand-400">40 Pts</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Passes 10 consecutive runs with no split-vote timeouts and single leader election.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Heartbeat &amp; Network Skew</span>
                  <span className="font-mono text-brand-400">30 Pts</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Proper heartbeat broadcast interval (&lt;= 100ms) with simulated packet drops.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Race Condition &amp; Concurrency</span>
                  <span className="font-mono text-brand-400">30 Pts</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Zero data race warnings under Go race detector (<code className="text-slate-300">go test -race</code>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
