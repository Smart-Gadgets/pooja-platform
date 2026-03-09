'use client';

import RoleSidebar from '@/components/role/RoleSidebar';
import RoleGuard from '@/components/role/RoleGuard';

const PANDIT_NAV = [
  { href: '/pandit', icon: '📊', label: 'Dashboard' },
  { href: '/pandit/bookings', icon: '📅', label: 'My Bookings' },
  { href: '/pandit/profile', icon: '👤', label: 'My Profile' },
];

export default function PanditLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['PANDIT']}>
      <div className="min-h-screen bg-gray-50">
        <RoleSidebar
          title="Pandit Portal"
          subtitle="🙏 PANDIT PORTAL"
          accentColor="bg-amber-600"
          accentColorLight="bg-amber-50"
          accentText="text-amber-700"
          navItems={PANDIT_NAV}
        />
        <main className="lg:ml-64 min-h-screen">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
