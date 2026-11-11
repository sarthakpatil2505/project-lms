import { create } from 'zustand';

interface QuizState {
  quizId: string | null;
  timeRemainingSeconds: number;
  totalTimeSeconds: number;
  isTimerRunning: boolean;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string | string[]>; // questionId -> optionId(s)
  flaggedQuestionIds: string[];
  isSubmitted: boolean;
  isSubmitting: boolean;
  score: number | null;
  totalPoints: number | null;
  
  // Actions
  initializeQuiz: (quizId: string, durationMinutes: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: (totalQuestions: number) => void;
  prevQuestion: () => void;
  selectSingleAnswer: (questionId: string, optionId: string) => void;
  toggleMultipleAnswer: (questionId: string, optionId: string) => void;
  toggleFlagQuestion: (questionId: string) => void;
  tickTimer: () => void;
  setTimeRemaining: (seconds: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  completeSubmission: (score: number, totalPoints: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  quizId: null,
  timeRemainingSeconds: 0,
  totalTimeSeconds: 0,
  isTimerRunning: false,
  currentQuestionIndex: 0,
  selectedAnswers: {},
  flaggedQuestionIds: [],
  isSubmitted: false,
  isSubmitting: false,
  score: null,
  totalPoints: null,

  initializeQuiz: (quizId, durationMinutes) =>
    set({
      quizId,
      timeRemainingSeconds: durationMinutes * 60,
      totalTimeSeconds: durationMinutes * 60,
      isTimerRunning: true,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      flaggedQuestionIds: [],
      isSubmitted: false,
      isSubmitting: false,
      score: null,
      totalPoints: null,
    }),

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  nextQuestion: (totalQuestions) =>
    set((state) => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, totalQuestions - 1),
    })),

  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),

  selectSingleAnswer: (questionId, optionId) =>
    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionId]: optionId,
      },
    })),

  toggleMultipleAnswer: (questionId, optionId) =>
    set((state) => {
      const current = (state.selectedAnswers[questionId] as string[]) || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return {
        selectedAnswers: {
          ...state.selectedAnswers,
          [questionId]: updated,
        },
      };
    }),

  toggleFlagQuestion: (questionId) =>
    set((state) => {
      const exists = state.flaggedQuestionIds.includes(questionId);
      return {
        flaggedQuestionIds: exists
          ? state.flaggedQuestionIds.filter((id) => id !== questionId)
          : [...state.flaggedQuestionIds, questionId],
      };
    }),

  tickTimer: () =>
    set((state) => {
      if (state.timeRemainingSeconds <= 1) {
        return {
          timeRemainingSeconds: 0,
          isTimerRunning: false,
        };
      }
      return { timeRemainingSeconds: state.timeRemainingSeconds - 1 };
    }),

  setTimeRemaining: (seconds) => set({ timeRemainingSeconds: seconds }),

  startTimer: () => set({ isTimerRunning: true }),

  pauseTimer: () => set({ isTimerRunning: false }),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

  completeSubmission: (score, totalPoints) =>
    set({
      isSubmitted: true,
      isSubmitting: false,
      isTimerRunning: false,
      score,
      totalPoints,
    }),

  resetQuiz: () =>
    set({
      quizId: null,
      timeRemainingSeconds: 0,
      totalTimeSeconds: 0,
      isTimerRunning: false,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      flaggedQuestionIds: [],
      isSubmitted: false,
      isSubmitting: false,
      score: null,
      totalPoints: null,
    }),
}));
