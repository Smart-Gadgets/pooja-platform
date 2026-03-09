'use client';

import RoleSidebar from '@/components/role/RoleSidebar';
import RoleGuard from '@/components/role/RoleGuard';

const ADMIN_NAV = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/users', icon: '👥', label: 'User Management' },
  { href: '/admin/products', icon: '📦', label: 'Product Approval' },
  { href: '/admin/pandits', icon: '🙏', label: 'Pandit Verification' },
  { href: '/admin/orders', icon: '🧾', label: 'Orders & Bookings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-gray-50">
        <RoleSidebar
          title="Admin Panel"
          subtitle="👑 ADMIN PANEL"
          accentColor="bg-indigo-600"
          accentColorLight="bg-indigo-50"
          accentText="text-indigo-600"
          navItems={ADMIN_NAV}
        />
        <main className="lg:ml-64 min-h-screen">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
