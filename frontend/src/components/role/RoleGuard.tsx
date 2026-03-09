'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function RoleGuard({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, loadUser } = useAuthStore();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => { loadUser(); }, [loadUser]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace('/auth/login'); return; }
    if (user && !allowedRoles.includes(user.role)) {
      // Redirect to correct dashboard
      const dest = user.role === 'ADMIN' ? '/admin' : user.role === 'SELLER' ? '/seller' : user.role === 'PANDIT' ? '/pandit' : '/';
      router.replace(dest);
      return;
    }
    setChecked(true);
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-5xl animate-pulse block mb-3">🪔</span>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
