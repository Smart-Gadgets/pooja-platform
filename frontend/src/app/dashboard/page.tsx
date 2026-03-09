'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function DashboardRedirect() {
  const { user, isAuthenticated, isLoading, loadUser } = useAuthStore();
  const router = useRouter();
  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace('/auth/login'); return; }
    if (!user) return;
    switch (user.role) {
      case 'ADMIN': router.replace('/admin'); break;
      case 'SELLER': router.replace('/seller'); break;
      case 'PANDIT': router.replace('/pandit'); break;
      default: router.replace('/'); break;
    }
  }, [isLoading, isAuthenticated, user, router]);

  return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-pulse text-5xl">🪔</div></div>;
}
