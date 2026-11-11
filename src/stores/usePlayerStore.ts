import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerState {
  // Video playback status
  activeLessonId: string | null;
  playbackTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  isCompleted: boolean;
  autoAdvance: boolean;
  
  // UI & controls state
  isSidebarOpen: boolean;
  activeTab: 'overview' | 'transcript' | 'notes' | 'discussion';
  transcriptSearchQuery: string;
  activeTranscriptCue: number | null;

  // Actions
  setActiveLessonId: (id: string | null) => void;
  setPlaybackTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsCompleted: (completed: boolean) => void;
  setAutoAdvance: (autoAdvance: boolean) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: 'overview' | 'transcript' | 'notes' | 'discussion') => void;
  setTranscriptSearchQuery: (query: string) => void;
  setActiveTranscriptCue: (cueIndex: number | null) => void;
  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      activeLessonId: null,
      playbackTime: 0,
      duration: 0,
      playbackRate: 1.0,
      volume: 0.8,
      isMuted: false,
      isPlaying: false,
      isCompleted: false,
      autoAdvance: true,
      isSidebarOpen: true,
      activeTab: 'overview',
      transcriptSearchQuery: '',
      activeTranscriptCue: null,

      setActiveLessonId: (id) => set({ activeLessonId: id, playbackTime: 0, isCompleted: false }),
      setPlaybackTime: (time) => set({ playbackTime: time }),
      setDuration: (duration) => set({ duration }),
      setPlaybackRate: (rate) => set({ playbackRate: rate }),
      setVolume: (volume) => set({ volume }),
      setIsMuted: (isMuted) => set({ isMuted }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setIsCompleted: (isCompleted) => set({ isCompleted }),
      setAutoAdvance: (autoAdvance) => set({ autoAdvance }),
      setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setTranscriptSearchQuery: (query) => set({ transcriptSearchQuery: query }),
      setActiveTranscriptCue: (cueIndex) => set({ activeTranscriptCue: cueIndex }),
      resetPlayer: () =>
        set({
          playbackTime: 0,
          isPlaying: false,
          isCompleted: false,
          activeTranscriptCue: null,
        }),
    }),
    {
      name: 'lms-player-preferences',
      partialize: (state) => ({
        playbackRate: state.playbackRate,
        volume: state.volume,
        isMuted: state.isMuted,
        autoAdvance: state.autoAdvance,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
