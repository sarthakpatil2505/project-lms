import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let profile = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        profile = profileData;
      }
    } catch {
      // Fallback to demo mode if auth fails
    }
  }

  // If in production without user, redirect to login
  if (!user && process.env.NODE_ENV === 'production') {
    redirect('/login');
  }

  // Demo user defaults for instant zero-friction local exploration
  const userRole = profile?.role || 'student';
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Alex Mercer';
  const userEmail = user?.email || 'alex.mercer@cs.mit.edu';
  const avatarUrl = profile?.avatar_url || undefined;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <DashboardSidebar userRole={userRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          userEmail={userEmail}
          userName={userName}
          userRole={userRole}
          avatarUrl={avatarUrl}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
