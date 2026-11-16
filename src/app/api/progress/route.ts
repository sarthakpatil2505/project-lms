import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { enrollmentId, lessonId, lastPositionSeconds, highestPositionSeconds, isCompleted } = await request.json();

  const { error } = await supabase.from('lesson_progress').upsert(
    {
      enrollment_id: enrollmentId,
      lesson_id: lessonId,
      last_position_seconds: lastPositionSeconds,
      highest_position_seconds: highestPositionSeconds,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    },
    { onConflict: 'enrollment_id,lesson_id' },
  );

  // If completed, recalculate enrollment progress
  if (isCompleted && enrollmentId) {
    // Get total lessons and completed count for this enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('id', enrollmentId)
      .single();

    if (enrollment) {
      const { count: totalLessons } = await supabase
        .from('lessons')
        .select('id', { count: 'exact' })
        .in('module_id', 
          supabase.from('modules').select('id').eq('course_id', enrollment.course_id) as any
        );
      
      const { count: completedLessons } = await supabase
        .from('lesson_progress')
        .select('id', { count: 'exact' })
        .eq('enrollment_id', enrollmentId)
        .eq('is_completed', true);

      const progress = totalLessons && completedLessons 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      await supabase
        .from('enrollments')
        .update({ 
          progress_percentage: progress,
          current_lesson_id: lessonId,
        })
        .eq('id', enrollmentId);
    }
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
