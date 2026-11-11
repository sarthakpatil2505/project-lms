import { TimedQuizEngine } from '@/components/quiz/TimedQuizEngine';

interface Props {
  params: {
    slug: string;
    quizId: string;
  };
}

export const metadata = {
  title: 'Timed Examination | AetherLMS',
  description: 'NPTEL-style automated grading quiz engine with countdown timers.',
};

export default function QuizPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <TimedQuizEngine
        courseSlug={params.slug}
        quizId={params.quizId}
        quizTitle="Week 4 Graded Examination: Raft Consensus Safety & Fault Tolerance"
        durationMinutes={30}
        passingScorePercent={70}
      />
    </div>
  );
}
