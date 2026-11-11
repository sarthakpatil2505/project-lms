import { AdminDashboardView } from '@/components/admin/AdminDashboardView';

export const metadata = {
  title: 'Admin Command Center | AetherLMS',
  description: 'Platform metrics, course approval workflows, and RBAC governance.',
};

export default function AdminPage() {
  return <AdminDashboardView />;
}
