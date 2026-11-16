import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { quizId, answers, timeTakenSeconds } = await request.json();

  // Load quiz questions with correct answers
  const { data: quiz } = await supabase
    .from('quizzes')
    .select(`
      id, time_limit_minutes, passing_score_percent,
      quiz_questions(id, correct_options, points)
    `)
    .eq('id', quizId)
    .single();

  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

  // Grade the quiz server-side
  let totalPoints = 0;
  let earnedPoints = 0;
  const questions = (quiz as any).quiz_questions as Array<{
    id: string;
    correct_options: string[];
    points: number;
  }>;

  for (const q of questions) {
    totalPoints += q.points;
    const studentAnswers: string[] = answers[q.id] ?? [];
    const correctAnswers = q.correct_options ?? [];
    // Both arrays must match exactly (sorted)
    const sortedStudent = [...studentAnswers].sort();
    const sortedCorrect = [...correctAnswers].sort();
    if (JSON.stringify(sortedStudent) === JSON.stringify(sortedCorrect)) {
      earnedPoints += q.points;
    }
  }

  const scorePercent = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const isPassed = scorePercent >= (quiz as any).passing_score_percent;

  // Save attempt
  const { data: attempt, error } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id: quizId,
      user_id: user.id,
      score: earnedPoints,
      total_points: totalPoints,
      answers_snapshot: answers,
      time_taken_seconds: timeTakenSeconds,
      is_passed: isPassed,
    })
    .select('id, score')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    attemptId: attempt.id,
    score: earnedPoints,
    totalPoints,
    scorePercent: Math.round(scorePercent * 10) / 10,
    isPassed,
  });
}
