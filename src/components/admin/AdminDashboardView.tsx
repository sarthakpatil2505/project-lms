'use client';

import { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  BookOpen, 
  Award, 
  Database, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Search,
  Server,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminDashboardView() {
  const [pendingCourses, setPendingCourses] = useState([
    {
      id: 'c-rev-1',
      title: 'Full-Stack LLM Engineering & Agentic Systems',
      instructor: 'Prof. Elena Rostova',
      institution: 'Stanford AI Lab',
      weeks: 10,
      submittedDate: 'Nov 6, 2026',
    },
    {
      id: 'c-rev-2',
      title: 'Applied Cryptography & Zero-Knowledge Proofs',
      instructor: 'Dr. Sarah Chen',
      institution: 'UC Berkeley',
      weeks: 8,
      submittedDate: 'Nov 7, 2026',
    },
  ]);

  const [users, setUsers] = useState([
    { id: 'u-1', name: 'Alex Mercer', email: 'alex@mit.edu', role: 'student', enrolledCourses: 2 },
    { id: 'u-2', name: 'Dr. Alistair Vance', email: 'vance@mit.edu', role: 'instructor', enrolledCourses: 0 },
    { id: 'u-3', name: 'Devon TA', email: 'devon.ta@berkeley.edu', role: 'evaluator', enrolledCourses: 1 },
  ]);

  const handleApproveCourse = (id: string, title: string) => {
    setPendingCourses(pendingCourses.filter((c) => c.id !== id));
    toast.success(`Course "${title}" approved & published to catalog!`);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    toast.success(`User role updated to ${newRole}. RLS policies updated.`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
          Platform Governance
        </span>
        <h1 className="text-2xl font-extrabold text-white font-heading">
          System Administration &amp; Metrics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor PostgreSQL cluster health, approve academic courses, and govern RBAC permissions.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-brand-400">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Total Accounts</span>
          </div>
          <div className="text-2xl font-bold font-heading text-white">52,490</div>
          <p className="text-xs text-slate-400 mt-1">+1,240 enrolled this week</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-emerald-400">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Issued Certificates</span>
          </div>
          <div className="text-2xl font-bold font-heading text-white">14,210</div>
          <p className="text-xs text-slate-400 mt-1">100% cryptographically verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-sky-400">
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Published Tracks</span>
          </div>
          <div className="text-2xl font-bold font-heading text-white">48 Courses</div>
          <p className="text-xs text-slate-400 mt-1">2 pending review</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3 text-emerald-400">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">RLS &amp; Engine</span>
          </div>
          <div className="text-2xl font-bold font-heading text-white">99.99%</div>
          <p className="text-xs text-slate-400 mt-1">All 16 tables secured with RLS</p>
        </div>
      </div>

      {/* Course Approvals Queue */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            Curriculum Approvals Queue ({pendingCourses.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">Academic Board Review</span>
        </div>

        {pendingCourses.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No courses pending approval.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{course.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Instructor: {course.instructor} &bull; {course.institution} &bull; {course.weeks} Weeks
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveCourse(course.id, course.title)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve &amp; Publish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User RBAC Management Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
            RBAC Role Governance
          </span>
          <span className="text-xs text-slate-400 font-mono">RLS Enforced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Active Role</th>
                <th className="p-4 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">{u.name}</td>
                  <td className="p-4 text-slate-400 font-mono">{u.email}</td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-brand-300 border border-brand-800/40">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-brand-500"
                    >
                      <option value="student">student</option>
                      <option value="instructor">instructor</option>
                      <option value="evaluator">evaluator</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
