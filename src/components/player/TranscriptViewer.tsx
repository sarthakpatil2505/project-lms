'use client';

import { useEffect, useRef } from 'react';
import { Search, Clock } from 'lucide-react';
import { usePlayerStore } from '@/stores/usePlayerStore';

export interface TranscriptCue {
  id: number;
  timeSeconds: number;
  timeFormatted: string;
  speaker: string;
  text: string;
}

interface TranscriptProps {
  cues: TranscriptCue[];
  onSeek: (seconds: number) => void;
}

export function TranscriptViewer({ cues, onSeek }: TranscriptProps) {
  const {
    playbackTime,
    transcriptSearchQuery,
    setTranscriptSearchQuery,
  } = usePlayerStore();

  const activeCueRef = useRef<HTMLDivElement | null>(null);

  // Find active cue based on current video playback position
  const activeCue = cues.reduce((prev, curr) => {
    return curr.timeSeconds <= playbackTime ? curr : prev;
  }, cues[0]);

  // Scroll active cue into view smoothly
  useEffect(() => {
    if (activeCueRef.current) {
      activeCueRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeCue?.id]);

  const filteredCues = cues.filter((cue) =>
    cue.text.toLowerCase().includes(transcriptSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
      {/* Transcript Search */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={transcriptSearchQuery}
            onChange={(e) => setTranscriptSearchQuery(e.target.value)}
            placeholder="Search within video transcript..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Transcript Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCues.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No matches found for &quot;{transcriptSearchQuery}&quot;
          </div>
        ) : (
          filteredCues.map((cue) => {
            const isActive = activeCue?.id === cue.id;
            return (
              <div
                key={cue.id}
                ref={isActive ? activeCueRef : null}
                onClick={() => onSeek(cue.timeSeconds)}
                className={`p-3 rounded-xl transition-all cursor-pointer flex gap-3 text-xs leading-relaxed ${
                  isActive
                    ? 'bg-brand-950/60 border border-brand-500/40 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <button
                  className={`flex items-center gap-1 font-mono text-[11px] font-semibold shrink-0 self-start px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {cue.timeFormatted}
                </button>
                <div>
                  <span className="font-semibold text-slate-300 mr-1.5">{cue.speaker}:</span>
                  <span>{cue.text}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
