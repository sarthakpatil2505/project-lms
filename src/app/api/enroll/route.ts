import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ error: 'courseId required' }, { status: 400 });
  }
  // Check if already enrolled
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single();
  if (existing) {
    return NextResponse.json({ enrolled: true, enrollmentId: existing.id });
  }
  // Get first lesson of the course
  const { data: firstLesson } = await supabase
    .from('lessons')
    .select('id, modules!module_id(course_id)')
    .eq('modules.course_id', courseId)
    .order('order_index', { ascending: true })
    .limit(1)
    .single();

  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: user.id,
      course_id: courseId,
      current_lesson_id: firstLesson?.id ?? null,
    })
    .select('id')
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ enrolled: true, enrollmentId: data.id });
}
