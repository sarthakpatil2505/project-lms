'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Award, 
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useQuizStore } from '@/stores/useQuizStore';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  order: number;
  prompt: string;
  type: 'single_choice' | 'multiple_choice';
  options: { id: string; text: string }[];
  correctOptions: string[];
  points: number;
  explanation: string;
}

interface TimedQuizProps {
  courseSlug: string;
  quizId: string;
  quizTitle: string;
  durationMinutes: number;
  passingScorePercent: number;
}

export function TimedQuizEngine({
  courseSlug,
  quizId,
  quizTitle,
  durationMinutes = 30,
  passingScorePercent = 70,
}: TimedQuizProps) {
  const {
    timeRemainingSeconds,
    isTimerRunning,
    currentQuestionIndex,
    selectedAnswers,
    flaggedQuestionIds,
    isSubmitted,
    score,
    totalPoints,
    initializeQuiz,
    setCurrentQuestionIndex,
    nextQuestion,
    prevQuestion,
    selectSingleAnswer,
    toggleMultipleAnswer,
    toggleFlagQuestion,
    tickTimer,
    completeSubmission,
    resetQuiz,
  } = useQuizStore();

  const [questions] = useState<Question[]>([
    {
      id: 'q-1',
      order: 1,
      prompt: 'In the Raft consensus protocol, what happens when a follower node experiences an election timeout without receiving any AppendEntries RPC or RequestVote RPC?',
      type: 'single_choice',
      options: [
        { id: 'opt-a', text: 'It transitions to Leader state immediately and broadcasts heartbeats' },
        { id: 'opt-b', text: 'It transitions to Candidate state, increments currentTerm, votes for itself, and broadcasts RequestVote' },
        { id: 'opt-c', text: 'It drops out of the cluster and initiates a full recovery snapshot' },
        { id: 'opt-d', text: 'It remains Follower and requests re-synchronization from the coordinator' },
      ],
      correctOptions: ['opt-b'],
      points: 2,
      explanation: 'Followers wait for heartbeats. If no communication arrives during the randomized election timeout, the follower assumes leader failure, increments its term, transitions to candidate state, votes for itself, and requests votes from peers.',
    },
    {
      id: 'q-2',
      order: 2,
      prompt: 'Which of the following conditions must be satisfied for a Raft leader to commit a log entry from its current term? (Select all that apply)',
      type: 'multiple_choice',
      options: [
        { id: 'opt-a', text: 'The entry must be stored on a majority of cluster nodes' },
        { id: 'opt-b', text: 'The entry must be from the leader’s current term' },
        { id: 'opt-c', text: 'All previous log entries must also be committed' },
        { id: 'opt-d', text: 'Every follower in the entire cluster must send an explicit acknowledgment' },
      ],
      correctOptions: ['opt-a', 'opt-b', 'opt-c'],
      points: 3,
      explanation: 'In Raft, a leader only commits current-term entries once replicated on a majority of nodes (a and b), which inductively commits all preceding entries (c). Unanimous agreement (d) is not required; only a strict majority is required.',
    },
    {
      id: 'q-3',
      order: 3,
      prompt: 'According to the FLP Impossibility Theorem (Fischer, Lynch, Paterson 1985), in an asynchronous network model:',
      type: 'single_choice',
      options: [
        { id: 'opt-a', text: 'Deterministic consensus is impossible even with a single unannounced crash failure' },
        { id: 'opt-b', text: 'Byzantine fault tolerance requires 5f + 1 nodes' },
        { id: 'opt-c', text: 'Clock drift cannot exceed 100 milliseconds' },
        { id: 'opt-d', text: 'Consensus is solvable if message loss is less than 5%' },
      ],
      correctOptions: ['opt-a'],
      points: 2,
      explanation: 'The classic FLP proof established that no deterministic asynchronous protocol can guarantee consensus in bounded time if even a single process can crash silently.',
    },
    {
      id: 'q-4',
      order: 4,
      prompt: 'Why does Raft randomize election timeouts (typically between 150ms and 300ms)?',
      type: 'single_choice',
      options: [
        { id: 'opt-a', text: 'To encrypt RPC communication against eavesdroppers' },
        { id: 'opt-b', text: 'To prevent split-vote deadlocks where multiple candidates split votes equally' },
        { id: 'opt-c', text: 'To reduce disk I/O when writing log entries to non-volatile storage' },
        { id: 'opt-d', text: 'To synchronize physical clocks across distinct geographical datacenters' },
      ],
      correctOptions: ['opt-b'],
      points: 2,
      explanation: 'Randomized election timeouts stagger when candidates initiate elections, ensuring one node times out first and captures the majority before rivals wake up.',
    },
    {
      id: 'q-5',
      order: 5,
      prompt: 'In Lamport logical clocks, if event A causally precedes event B (A -> B), which of the following statements is strictly true?',
      type: 'single_choice',
      options: [
        { id: 'opt-a', text: 'L(A) < L(B)' },
        { id: 'opt-b', text: 'L(A) == L(B)' },
        { id: 'opt-c', text: 'L(A) > L(B)' },
        { id: 'opt-d', text: 'L(A) < L(B) and L(B) < L(A) concurrently' },
      ],
      correctOptions: ['opt-a'],
      points: 1,
      explanation: 'The Clock Condition asserts that if event A happens before event B, then the timestamp of A is strictly less than the timestamp of B: L(A) < L(B).',
    },
  ]);

  // Initialize quiz store on mount
  useEffect(() => {
    initializeQuiz(quizId, durationMinutes);
  }, [quizId, durationMinutes, initializeQuiz]);

  // 1-second countdown interval
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isSubmitted, tickTimer]);

  // Auto-submit when time reaches 0
  useEffect(() => {
    if (timeRemainingSeconds === 0 && !isSubmitted && isTimerRunning) {
      toast.error('Time expired! Quiz auto-submitted.');
      handleSubmitQuiz();
    }
  }, [timeRemainingSeconds, isSubmitted, isTimerRunning]);

  const currentQ = questions[currentQuestionIndex];

  const handleSubmitQuiz = () => {
    let earned = 0;
    let max = 0;

    questions.forEach((q) => {
      max += q.points;
      const userAns = selectedAnswers[q.id];
      if (q.type === 'single_choice') {
        if (userAns === q.correctOptions[0]) {
          earned += q.points;
        }
      } else {
        // multiple choice
        const userArr = (userAns as string[]) || [];
        const isMatch =
          userArr.length === q.correctOptions.length &&
          userArr.every((opt) => q.correctOptions.includes(opt));
        if (isMatch) {
          earned += q.points;
        }
      }
    });

    completeSubmission(earned, max);
    toast.success(`Quiz evaluated! Score: ${earned}/${max} points.`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentScore =
    totalPoints && score !== null ? Math.round((score / totalPoints) * 100) : 0;
  const isPassed = percentScore >= passingScorePercent;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Countdown Timer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
            NPTEL Timed Examination Engine
          </span>
          <h1 className="text-base sm:text-lg font-bold text-white">{quizTitle}</h1>
        </div>

        {/* Timer Badge */}
        {!isSubmitted && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold shadow-inner ${
              timeRemainingSeconds < 300
                ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-amber-600/40 text-amber-300'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Time Left: {formatTimer(timeRemainingSeconds)}</span>
          </div>
        )}
      </div>

      {/* Main Examination Canvas */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question View (Left 3 cols) */}
          <div className="lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-brand-950 text-brand-300 border border-brand-800 font-mono text-xs font-bold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-slate-400">
                  {currentQ.type === 'single_choice'
                    ? 'Single Correct Choice'
                    : 'Multiple Correct Choices'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-slate-300">
                  {currentQ.points} {currentQ.points === 1 ? 'Point' : 'Points'}
                </span>
                <button
                  onClick={() => toggleFlagQuestion(currentQ.id)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    flaggedQuestionIds.includes(currentQ.id)
                      ? 'bg-amber-950 border-amber-600 text-amber-400'
                      : 'border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="Flag for review"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Question Prompt */}
            <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              {currentQ.prompt}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected =
                  currentQ.type === 'single_choice'
                    ? selectedAnswers[currentQ.id] === opt.id
                    : ((selectedAnswers[currentQ.id] as string[]) || []).includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (currentQ.type === 'single_choice') {
                        selectSingleAnswer(currentQ.id, opt.id);
                      } else {
                        toggleMultipleAnswer(currentQ.id, opt.id);
                      }
                    }}
                    className={`p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-brand-950/60 border-brand-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'border-brand-500 bg-brand-600 text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="leading-relaxed">{opt.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Question Controls */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => nextQuestion(questions.length)}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  Submit &amp; Score
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Question Jump Palette (NPTEL Right Column) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Question Palette
            </h3>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!selectedAnswers[q.id];
                const isCurrent = currentQuestionIndex === idx;
                const isFlagged = flaggedQuestionIds.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-all relative ${
                      isCurrent
                        ? 'ring-2 ring-brand-400 bg-brand-600 text-white'
                        : isFlagged
                        ? 'bg-amber-950 border border-amber-600 text-amber-300'
                        : isAnswered
                        ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Palette legend */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-600" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-950 border border-amber-600" />
                <span>Flagged for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-800" />
                <span>Unattempted</span>
              </div>
            </div>

            {/* Final Submit action */}
            <button
              onClick={handleSubmitQuiz}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-colors"
            >
              Complete Examination
            </button>
          </div>
        </div>
      ) : (
        /* Evaluation & Results Canvas */
        <div className="space-y-8">
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <div
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                isPassed ? 'bg-emerald-950 text-emerald-400 border border-emerald-600' : 'bg-rose-950 text-rose-400 border border-rose-600'
              }`}
            >
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                Evaluation Complete
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                You Scored {score} / {totalPoints} ({percentScore}%)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Passing requirement: {passingScorePercent}% &bull; Best-of-8 score updated
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold font-mono border">
              {isPassed ? (
                <span className="text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  PASSED &bull; Counts towards Certificate
                </span>
              ) : (
                <span className="text-rose-400 bg-rose-950 px-3 py-1 rounded-full border border-rose-800">
                  BELOW THRESHOLD &bull; Eligible for retake
                </span>
              )}
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                href={`/course/${courseSlug}/learn`}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
              >
                Return to Course Room
              </Link>
            </div>
          </div>

          {/* Detailed Question Review with Explanations */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Comprehensive Answer Breakdown
            </h3>

            {questions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect =
                q.type === 'single_choice'
                  ? userAns === q.correctOptions[0]
                  : Array.isArray(userAns) &&
                    userAns.length === q.correctOptions.length &&
                    userAns.every((opt) => q.correctOptions.includes(opt));

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : 'bg-rose-950/20 border-rose-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">Question {idx + 1}</span>
                    <span
                      className={`font-bold ${
                        isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isCorrect ? `+${q.points} Pts` : '0 Pts'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white">{q.prompt}</p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-brand-400 font-mono">
                      Official Instructor Explanation:
                    </span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
