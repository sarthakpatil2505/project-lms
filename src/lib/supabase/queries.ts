import { createClient } from './server';

// ── Courses ──────────────────────────────────────────────────────────────────
export async function getPublishedCourses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select(`
      id, title, slug, headline, thumbnail_url, difficulty, 
      estimated_hours, passing_grade_percent, best_of_n_count,
      total_assignment_weeks, tags, is_free, price_cents,
      profiles!instructor_id(id, full_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      profiles!instructor_id(id, full_name, avatar_url, bio, headline),
      modules(
        id, title, description, week_number, order_index, is_prerequisite_locked,
        lessons(id, title, slug, type, order_index, duration_seconds, is_preview, mux_playback_id, video_url)
      )
    `)
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

// ── Enrollments ───────────────────────────────────────────────────────────────
export async function getUserEnrollments(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id, status, progress_percentage, final_calculated_score, enrolled_at,
      courses(id, title, slug, thumbnail_url, passing_grade_percent,
        profiles!instructor_id(full_name)),
      lessons!current_lesson_id(id, title)
    `)
    .eq('user_id', userId)
    .eq('status', 'active');
  if (error) throw error;
  return data ?? [];
}

export async function checkEnrollment(userId: string, courseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();
  return !!data;
}

export async function enrollUserInCourse(userId: string, courseId: string, firstLessonId?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      current_lesson_id: firstLessonId ?? null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data;
}

// ── Lesson Progress ───────────────────────────────────────────────────────────
export async function getLessonProgress(enrollmentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id, is_completed, last_position_seconds, highest_position_seconds')
    .eq('enrollment_id', enrollmentId);
  return data ?? [];
}

export async function upsertLessonProgress(
  enrollmentId: string,
  lessonId: string,
  lastPositionSeconds: number,
  highestPositionSeconds: number,
  isCompleted: boolean,
) {
  const supabase = await createClient();
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
  if (error) console.error('[upsertLessonProgress]', error);
}

// ── Assignments & Submissions ─────────────────────────────────────────────────
export async function getAssignmentsForCourse(courseId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('assignments')
    .select('id, title, description, week_number, deadline_at, max_score, assignment_type')
    .eq('course_id', courseId)
    .order('week_number', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getStudentSubmissions(userId: string, courseId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('assignment_submissions')
    .select(`
      id, submission_text, file_url, file_name, file_hash,
      submitted_at, score, status, instructor_feedback, graded_at,
      assignments(id, title, week_number, max_score, deadline_at, 
        courses(id, title, slug))
    `)
    .eq('student_id', userId)
    .order('submitted_at', { ascending: false });
  if (courseId) {
    query = query.eq('assignments.courses.id', courseId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function submitAssignment(payload: {
  assignmentId: string;
  studentId: string;
  fileUrl?: string;
  fileName?: string;
  fileHash?: string;
  submissionText?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('assignment_submissions')
    .insert({
      assignment_id: payload.assignmentId,
      student_id: payload.studentId,
      file_url: payload.fileUrl,
      file_name: payload.fileName,
      file_hash: payload.fileHash,
      submission_text: payload.submissionText,
      status: 'submitted',
    })
    .select('id, submitted_at, file_hash')
    .single();
  if (error) throw error;
  return data;
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
export async function getQuizWithQuestions(quizId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      id, title, description, time_limit_minutes, passing_score_percent,
      quiz_questions(id, order_index, prompt, type, options, correct_options, points, explanation)
    `)
    .eq('id', quizId)
    .single();
  if (error) throw error;
  return data;
}

export async function saveQuizAttempt(payload: {
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  answers: Record<string, string[]>;
  timeTakenSeconds: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id: payload.quizId,
      user_id: payload.userId,
      score: payload.score,
      total_points: payload.totalPoints,
      answers_snapshot: payload.answers,
      time_taken_seconds: payload.timeTakenSeconds,
      is_passed: payload.score >= 0,
    })
    .select('id, score')
    .single();
  if (error) throw error;
  return data;
}

// ── Certificates ──────────────────────────────────────────────────────────────
export async function getCertificateById(certificateId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('certificates')
    .select(`
      id, certificate_number, status, issued_at, final_score,
      verification_hash,
      profiles!user_id(full_name, email),
      courses!course_id(title, passing_grade_percent,
        profiles!instructor_id(full_name))
    `)
    .eq('id', certificateId)
    .single();
  if (error) return null;
  return data;
}

export async function getUserCertificates(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('certificates')
    .select(`
      id, certificate_number, status, issued_at, final_score,
      courses!course_id(title, slug)
    `)
    .eq('user_id', userId)
    .eq('status', 'issued');
  return data ?? [];
}

// ── Instructor ────────────────────────────────────────────────────────────────
export async function getSubmissionsForInstructor(instructorId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('assignment_submissions')
    .select(`
      id, file_url, file_name, submitted_at, score, status, instructor_feedback,
      profiles!student_id(id, full_name, email, avatar_url),
      assignments!assignment_id(id, title, week_number, max_score,
        courses!course_id(id, title, slug, instructor_id))
    `)
    .eq('assignments.courses.instructor_id', instructorId)
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function gradeSubmission(payload: {
  submissionId: string;
  score: number;
  feedback: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('assignment_submissions')
    .update({
      score: payload.score,
      instructor_feedback: payload.feedback,
      status: 'graded',
      graded_at: new Date().toISOString(),
    })
    .eq('id', payload.submissionId);
  if (error) throw error;
}

// ── Forum ─────────────────────────────────────────────────────────────────────
export async function getForumThreads(courseId: string, moduleId?: string) {
  const supabase = await createClient();
  let q = supabase
    .from('forum_threads')
    .select(`
      id, title, body, is_pinned, created_at, upvotes,
      profiles!author_id(full_name, avatar_url, role),
      forum_replies(count)
    `)
    .eq('course_id', courseId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (moduleId) q = q.eq('module_id', moduleId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function createForumThread(payload: {
  courseId: string;
  moduleId?: string;
  authorId: string;
  title: string;
  body: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('forum_threads')
    .insert({
      course_id: payload.courseId,
      module_id: payload.moduleId,
      author_id: payload.authorId,
      title: payload.title,
      body: payload.body,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data;
}
