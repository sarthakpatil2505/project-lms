'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  CalendarCheck2,
  FileCheck2,
  Award,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  Edit3,
  CheckCircle,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SidebarProps {
  userRole?: 'student' | 'instructor' | 'evaluator' | 'admin';
}

export function DashboardSidebar({ userRole = 'student' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      router.push('/login');
      router.refresh();
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const studentLinks = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Enrolled Courses', href: '/dashboard/courses', icon: BookOpen },
    { label: 'Weekly Assignments', href: '/dashboard/assignments', icon: CalendarCheck2 },
    { label: 'Quizzes & Tests', href: '/dashboard/quizzes', icon: FileCheck2 },
    { label: 'Certificates & Scores', href: '/dashboard/certificates', icon: Award },
    { label: 'Discussion Forums', href: '/dashboard/forums', icon: MessageSquare },
  ];

  const instructorLinks = [
    { label: 'Course Studio', href: '/instructor/courses', icon: Edit3 },
    { label: 'Assignment Builder', href: '/instructor/assignments', icon: CalendarCheck2 },
    { label: 'Submissions Gradebook', href: '/instructor/gradebook', icon: CheckCircle },
    { label: 'Analytics & Funnels', href: '/instructor/analytics', icon: BarChart3 },
  ];

  const adminLinks = [
    { label: 'Admin Command', href: '/admin', icon: ShieldAlert },
    { label: 'Course Approvals', href: '/admin/approvals', icon: BookOpen },
    { label: 'User Roles & RLS', href: '/admin/users', icon: LayoutDashboard },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base font-heading">
                Aether<span className="text-brand-400">LMS</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-0.5">
                {userRole} Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-190px)]">
          {/* Student Core */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-mono">
              Learning Portal
            </div>
            <div className="space-y-1">
              {studentLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Instructor Section if applicable */}
          {(userRole === 'instructor' || userRole === 'admin') && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-3 mb-2 font-mono flex items-center justify-between">
                <span>Instructor Studio</span>
              </div>
              <div className="space-y-1">
                {instructorLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Admin Section if applicable */}
          {userRole === 'admin' && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 px-3 mb-2 font-mono">
                System Administration
              </div>
              <div className="space-y-1">
                {adminLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer User Info & Sign Out */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/help"
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Support & Guidelines</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
