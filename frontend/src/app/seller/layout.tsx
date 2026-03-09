'use client';

import RoleSidebar from '@/components/role/RoleSidebar';
import RoleGuard from '@/components/role/RoleGuard';

const SELLER_NAV = [
  { href: '/seller', icon: '📊', label: 'Dashboard' },
  { href: '/seller/products', icon: '📦', label: 'My Products' },
  { href: '/seller/products/new', icon: '➕', label: 'Add Product' },
  { href: '/seller/orders', icon: '🧾', label: 'Orders Received' },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['SELLER']}>
      <div className="min-h-screen bg-gray-50">
        <RoleSidebar
          title="Seller Portal"
          subtitle="🏪 SELLER PORTAL"
          accentColor="bg-emerald-600"
          accentColorLight="bg-emerald-50"
          accentText="text-emerald-600"
          navItems={SELLER_NAV}
        />
        <main className="lg:ml-64 min-h-screen">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </RoleGuard>
  );
}
