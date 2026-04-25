import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/admin/components/layout/AdminSidebar';
import { useAdminAuth } from '@/admin/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

