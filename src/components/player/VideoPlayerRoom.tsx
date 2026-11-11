'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  FileText, 
  MessageSquare, 
  Subtitles, 
  Download, 
  Share2,
  Clock,
  Send,
  ThumbsUp
} from 'lucide-react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { LessonSidebar, ModuleItem } from '@/components/player/LessonSidebar';
import { TranscriptViewer, TranscriptCue } from '@/components/player/TranscriptViewer';
import toast from 'react-hot-toast';

interface PlayerRoomProps {
  slug: string;
}

export function VideoPlayerRoom({ slug }: PlayerRoomProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    playbackTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    isPlaying,
    isCompleted,
    isSidebarOpen,
    activeTab,
    setPlaybackTime,
    setDuration,
    setPlaybackRate,
    setVolume,
    setIsMuted,
    setIsPlaying,
    setIsCompleted,
    toggleSidebar,
    setActiveTab,
  } = usePlayerStore();

  const [activeLessonId, setActiveLessonId] = useState('les-4-2');

  // Sample Cues for the lesson transcript
  const transcriptCues: TranscriptCue[] = [
    {
      id: 1,
      timeSeconds: 0,
      timeFormatted: '00:00',
      speaker: 'Dr. Vance',
      text: 'Welcome back to Module 4. Today we tackle the cornerstone of practical consensus: the Raft algorithm.',
    },
    {
      id: 2,
      timeSeconds: 15,
      timeFormatted: '00:15',
      speaker: 'Dr. Vance',
      text: 'Unlike Paxos, which separates consensus from state machine replication, Raft was designed specifically for understandability and direct operational implementation.',
    },
    {
      id: 3,
      timeSeconds: 45,
      timeFormatted: '00:45',
      speaker: 'Dr. Vance',
      text: 'Every node in a Raft cluster operates in one of three states: Follower, Candidate, or Leader. Time is sliced into arbitrary terms.',
    },
    {
      id: 4,
      timeSeconds: 90,
      timeFormatted: '01:30',
      speaker: 'Dr. Vance',
      text: 'If a follower receives no communication from a leader over an election timeout window, it assumes the leader has failed and transitions to candidate state.',
    },
    {
      id: 5,
      timeSeconds: 140,
      timeFormatted: '02:20',
      speaker: 'Dr. Vance',
      text: 'The candidate increments its current term, votes for itself, and broadcasts RequestVote RPCs to all other peers in the cluster.',
    },
    {
      id: 6,
      timeSeconds: 210,
      timeFormatted: '03:30',
      speaker: 'Dr. Vance',
      text: 'A candidate wins the election if it receives votes from a strict majority of nodes. Once elected, it immediately sends periodic heartbeats.',
    },
  ];

  // Sample modules data
  const sampleModules: ModuleItem[] = [
    {
      id: 'm-1',
      weekNumber: 1,
      title: 'Distributed Clocks & Asynchrony',
      isLocked: false,
      lessons: [
        { id: 'les-1-1', title: '1.1 Physical Clocks & Network Skew', type: 'video', duration: '24m', isCompleted: true },
        { id: 'les-1-2', title: '1.2 Lamport Logical Clocks', type: 'video', duration: '32m', isCompleted: true },
      ],
      assignment: { id: 'assign-w1', title: 'Assignment 1: Vector Clocks', deadline: 'Submitted', isSubmitted: true },
    },
    {
      id: 'm-2',
      weekNumber: 2,
      title: 'State Machine Replication',
      isLocked: false,
      lessons: [
        { id: 'les-2-1', title: '2.1 Deterministic State Machines', type: 'video', duration: '28m', isCompleted: true },
        { id: 'les-2-2', title: '2.2 Primary-Backup Fault Tolerance', type: 'video', duration: '35m', isCompleted: true },
      ],
      assignment: { id: 'assign-w2', title: 'Assignment 2: Backup Service', deadline: 'Submitted', isSubmitted: true },
    },
    {
      id: 'm-3',
      weekNumber: 3,
      title: 'Classical Paxos Protocol',
      isLocked: false,
      lessons: [
        { id: 'les-3-1', title: '3.1 FLP Impossibility Proof', type: 'video', duration: '30m', isCompleted: true },
        { id: 'les-3-2', title: '3.2 Multi-Paxos Protocol Flow', type: 'video', duration: '45m', isCompleted: true },
      ],
      assignment: { id: 'assign-w3', title: 'Assignment 3: Multi-Paxos Protocol', deadline: 'Submitted', isSubmitted: true },
    },
    {
      id: 'm-4',
      weekNumber: 4,
      title: 'Raft Consensus Algorithm',
      isLocked: false,
      lessons: [
        { id: 'les-4-1', title: '4.1 Raft Leader Election State Machine', type: 'video', duration: '34m', isCompleted: true },
        { id: 'les-4-2', title: '4.2 Raft Log Replication & Safety Invariants', type: 'video', duration: '42m', isCompleted: false },
      ],
      assignment: { id: 'assign-w4', title: 'Assignment 4: Raft in Go (Lab 2A)', deadline: 'Due in 26h', isSubmitted: false },
    },
  ];

  // Forum sample questions
  const [forumQuestions, setForumQuestions] = useState([
    {
      id: 'q1',
      author: 'Marcus Brody',
      time: '2 hours ago',
      title: 'How does Raft guarantee safety when a split-brain election occurs in an even-numbered cluster?',
      content: 'If we have 4 nodes and 2 vote for Candidate A and 2 vote for Candidate B, does neither reach majority until election timeout elapses?',
      upvotes: 14,
      instructorAnswered: true,
      answer: 'Exactly right, Marcus. Neither receives a majority of 3. Randomized election timeouts (150-300ms) prevent split-vote deadlocks from repeating indefinitely.',
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setForumQuestions([
      ...forumQuestions,
      {
        id: `q-${Date.now()}`,
        author: 'Alex (You)',
        time: 'Just now',
        title: 'Question regarding lesson timestamp ' + formatTime(playbackTime),
        content: newComment,
        upvotes: 1,
        instructorAnswered: false,
        answer: '',
      },
    ]);
    setNewComment('');
    toast.success('Question posted to module forum!');
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setPlaybackTime(seconds);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setPlaybackTime(videoRef.current.currentTime);
      if (
        videoRef.current.duration &&
        videoRef.current.currentTime / videoRef.current.duration > 0.9 &&
        !isCompleted
      ) {
        setIsCompleted(true);
        toast.success('Lesson marked as completed!');
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top App Bar */}
        <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] font-mono text-brand-400 font-bold uppercase">
                Distributed Systems &bull; Week 4
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                4.2 Raft Log Replication &amp; Safety Invariants
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsCompleted(!isCompleted);
                toast.success(isCompleted ? 'Marked incomplete' : 'Lesson completed!');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>

            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Toggle Curriculum Track"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Video Player Canvas */}
        <div className="bg-black relative aspect-video max-h-[58vh] w-full flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            className="w-full h-full object-contain cursor-pointer"
            onClick={handleTogglePlay}
          />

          {/* Floating Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 pointer-events-none">
            {/* Top Info */}
            <div className="flex items-center justify-between pointer-events-auto">
              <span className="text-xs font-semibold text-slate-200 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-md">
                1080p HD &bull; HLS Streaming
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success('Link copied to clipboard!')}
                  className="p-1.5 rounded-md bg-black/60 text-slate-300 hover:text-white backdrop-blur-md"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Scrubber & Buttons */}
            <div className="space-y-2 pointer-events-auto">
              {/* Progress Scrubber */}
              <div
                className="w-full bg-slate-700/60 h-2 rounded-full cursor-pointer relative overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  handleSeek(pos * (duration || 1));
                }}
              >
                <div
                  className="bg-brand-500 h-full rounded-full transition-all"
                  style={{ width: `${(playbackTime / (duration || 1)) * 100}%` }}
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between text-xs text-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlay}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleSeek(Math.max(0, playbackTime - 10))}
                    className="p-1.5 hover:text-white transition-colors"
                    title="Rewind 10s"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSeek(Math.min(duration, playbackTime + 10))}
                    className="p-1.5 hover:text-white transition-colors"
                    title="Forward 10s"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span>{formatTime(playbackTime)}</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-slate-400">{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Playback speed buttons */}
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg">
                    {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handleSpeedChange(rate)}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
                          playbackRate === rate
                            ? 'bg-brand-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  {/* Volume */}
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      if (videoRef.current) videoRef.current.muted = !isMuted;
                    }}
                    className="hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={() => videoRef.current?.requestFullscreen()}
                    className="hover:text-white"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Overview, Transcript, Discussion) */}
        <div className="border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'overview'
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Lesson Overview &amp; Code
            </button>

            <button
              onClick={() => setActiveTab('transcript')}
              className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'transcript'
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Subtitles className="w-4 h-4" />
              Interactive Transcript
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className={`py-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'discussion'
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Discussion Forum ({forumQuestions.length})
            </button>
          </div>
        </div>

        {/* Tab Content Panes */}
        <div className="p-6 max-w-5xl mx-auto w-full flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Key Concepts: Raft Log Matching Property
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  If two entries in different logs have the same index and term, then they store the same command, and their logs are identical in all preceding entries. This inductive invariant is maintained by the consistency check executed on every AppendEntries RPC call.
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
                <div className="text-slate-500 text-[11px] mb-2">// AppendEntries RPC Arguments in Go</div>
                <pre>{`type AppendEntriesArgs struct {
    Term         int        // leader's term
    LeaderId     int        // so follower can redirect clients
    PrevLogIndex int        // index of log entry immediately preceding new ones
    PrevLogTerm  int        // term of prevLogIndex entry
    Entries      []LogEntry // log entries to store (empty for heartbeat)
    LeaderCommit int        // leader's commitIndex
}`}</pre>
              </div>

              {/* Weekly Assignment Link */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                    Week 4 Graded Lab
                  </span>
                  <h4 className="text-sm font-bold text-white">Assignment 4: Raft Consensus in Go</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rigid deadline: Sunday at 23:59 UTC. Hard cutoff strictly enforced.
                  </p>
                </div>
                <Link
                  href={`/course/${slug}/assignment/assign-w4`}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors shrink-0"
                >
                  Go to Lab Submission
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="h-[460px]">
              <TranscriptViewer cues={transcriptCues} onSeek={handleSeek} />
            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-6">
              {/* Question Input */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                  Ask a question on Week 4 Raft Consensus
                </span>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Pose a technical question or discuss edge cases..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Post Question
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {forumQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{q.author}</span>
                      <span className="text-slate-500 font-mono">{q.time}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{q.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{q.content}</p>

                    {q.instructorAnswered && (
                      <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 space-y-1">
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-400 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                          Verified Instructor Answer
                        </span>
                        <p className="text-xs text-indigo-200">{q.answer}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                      <button className="flex items-center gap-1 hover:text-white transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{q.upvotes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <LessonSidebar
        courseSlug={slug}
        courseTitle="Advanced Distributed Systems"
        modules={sampleModules}
        activeLessonId={activeLessonId}
        onSelectLesson={(id) => {
          setActiveLessonId(id);
          toast.success(`Switched to lesson ${id}`);
        }}
      />
    </div>
  );
}
