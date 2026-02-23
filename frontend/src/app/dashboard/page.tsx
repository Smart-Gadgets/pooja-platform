'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, loadUser, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <span className="text-5xl animate-float">🪔</span>
      </div>
    );
  }

  const QUICK_ACTIONS = [
    { href: '/products', icon: '🛍️', label: 'Shop Products', desc: 'Browse pooja essentials' },
    { href: '/pandits', icon: '🙏', label: 'Find Pandit', desc: 'Book a ceremony' },
    { href: '/orders', icon: '📦', label: 'My Orders', desc: 'Track your orders' },
    { href: '/ai-assistant', icon: '🤖', label: 'AI Guide', desc: 'Ask about rituals' },
    { href: '/cart', icon: '🛒', label: 'My Cart', desc: 'View cart items' },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="card-flat p-8 bg-gradient-to-br from-burgundy-800 to-burgundy-900 text-white mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-saffron flex items-center justify-center text-white text-2xl font-display font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold">Namaste, {user.name}!</h1>
              <p className="text-saffron-200/70 mt-1">{user.email} · {user.role}</p>
            </div>
            <button onClick={logout} className="px-4 py-2 rounded-lg border border-white/20 text-sm text-white/80 hover:bg-white/10 transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="font-display text-2xl font-semibold text-burgundy-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="card group p-5 text-center hover:border-temple-300"
            >
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
              <h3 className="font-display text-sm font-semibold text-burgundy-700">{action.label}</h3>
              <p className="text-[10px] text-burgundy-400 mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Seller/Pandit specific sections */}
        {user.role === 'SELLER' && (
          <div className="card-flat p-6 mb-6">
            <h2 className="font-display text-xl font-semibold text-burgundy-700 mb-4">Seller Dashboard</h2>
            <p className="text-burgundy-400 text-sm mb-4">Manage your products, track orders, and grow your business.</p>
            <div className="flex gap-3">
              <Link href="/products" className="btn-primary text-sm">My Products</Link>
              <Link href="/orders" className="btn-secondary text-sm">Order Management</Link>
            </div>
          </div>
        )}

        {user.role === 'PANDIT' && (
          <div className="card-flat p-6 mb-6">
            <h2 className="font-display text-xl font-semibold text-burgundy-700 mb-4">Pandit Dashboard</h2>
            <p className="text-burgundy-400 text-sm mb-4">Manage your profile, bookings, and content.</p>
            <div className="flex gap-3">
              <Link href="/pandits" className="btn-primary text-sm">My Profile</Link>
              <Link href="/orders" className="btn-secondary text-sm">My Bookings</Link>
            </div>
          </div>
        )}

        {user.role === 'ADMIN' && (
          <div className="card-flat p-6 mb-6 border-2 border-temple-300">
            <h2 className="font-display text-xl font-semibold text-burgundy-700 mb-4">Admin Panel</h2>
            <p className="text-burgundy-400 text-sm mb-4">Manage users, products, pandits, and platform settings.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Users', icon: '👥' },
                { label: 'Products', icon: '📦' },
                { label: 'Pandits', icon: '🙏' },
                { label: 'Orders', icon: '🧾' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-saffron-50 text-center">
                  <span className="text-2xl block">{item.icon}</span>
                  <span className="text-sm font-medium text-burgundy-700 mt-1 block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
