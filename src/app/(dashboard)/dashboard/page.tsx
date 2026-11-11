import { StudentDashboard } from '@/components/dashboard/StudentDashboard';

export const metadata = {
  title: 'Dashboard | AetherLMS',
  description: 'Enterprise LMS combining Coursera modular learning with NPTEL weekly rigor.',
};

export default function DashboardPage() {
  return <StudentDashboard />;
}
