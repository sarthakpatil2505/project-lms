import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { getUserEnrollments } from '@/lib/supabase/queries';

export const metadata = {
  title: 'Dashboard | SkillBank LMS',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, avatar_url')
    .eq('id', user.id)
    .single();

  const enrollments = await getUserEnrollments(user.id).catch(() => []);

  return (
    <StudentDashboard
      user={{ id: user.id, email: user.email!, ...profile }}
      enrollments={enrollments as any}
    />
  );
}
