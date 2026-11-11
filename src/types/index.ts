export * from './database';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  difficulty?: string;
  sort?: 'newest' | 'popular' | 'rating';
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<string, string[]>;
  timeLeft: number | null;
  submitted: boolean;
  score: number | null;
}

export interface VideoPlayerState {
  playbackId: string;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  showTranscript: boolean;
}
