import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Discussion Forums | SkillBank LMS' };

export default async function ForumsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get enrollments to show relevant forums
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('courses(id, title, slug)')
    .eq('user_id', user.id)
    .eq('status', 'active');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-heading">Discussion Forums</h1>
        <p className="text-surface-muted text-sm mt-1">
          Course-specific discussion boards for enrolled courses
        </p>
      </div>

      {!enrollments || enrollments.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <p className="text-surface-muted">Enroll in a course to access its discussion forum.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enrollments.map((e: any) => (
            <a
              key={e.courses?.id}
              href={`/course/${e.courses?.slug}/learn`}
              className="block p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 transition-colors"
            >
              <div className="font-semibold text-white">{e.courses?.title}</div>
              <div className="text-xs text-surface-muted mt-1">
                Go to course to view and participate in module discussions
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
