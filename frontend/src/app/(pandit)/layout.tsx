'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

const NAV = [
  { href: '/pandit', icon: '🏠', label: 'Dashboard', exact: true },
  { href: '/pandit/bookings', icon: '📅', label: 'Bookings' },
  { href: '/pandit/profile', icon: '👤', label: 'My Profile' },
  { href: '/pandit/content', icon: '📝', label: 'Content' },
  { href: '/pandit/schedule', icon: '🕐', label: 'Schedule' },
];

export default function PanditLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, loadUser, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/auth/login');
    if (!isLoading && user && user.role !== 'PANDIT') router.replace('/dashboard');
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-amber-50"><div className="animate-pulse text-4xl">🪔</div></div>;

  const isActive = (item: any) => item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen bg-orange-50/30 font-sans">
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-gradient-to-b from-amber-800 to-amber-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-5 border-b border-amber-700/50">
          <Link href="/pandit" className="flex items-center gap-2.5">
            <span className="text-2xl">🙏</span>
            <div>
              <p className="text-sm font-bold text-white">Pandit Portal</p>
              <p className="text-[10px] text-amber-300/70">Pooja Platform</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive(item) ? 'bg-white/15 text-white font-medium' : 'text-amber-200/70 hover:text-white hover:bg-white/5'}`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-amber-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold">{user.name?.charAt(0)}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white truncate">{user.name}</p>
              <p className="text-[10px] text-amber-400/60 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1 text-center px-2 py-1.5 rounded text-xs text-amber-300/70 hover:text-white hover:bg-white/5">🛍 Store</Link>
            <button onClick={() => { logout(); router.push('/auth/login'); }} className="flex-1 text-center px-2 py-1.5 rounded text-xs text-red-300 hover:text-red-200 hover:bg-red-500/10">Logout</button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-60">
        <header className="h-14 bg-white/80 backdrop-blur border-b border-amber-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-amber-50">
            <svg className="w-5 h-5 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
          <div />
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">🙏 Pandit</span>
          </div>
        </header>
        <main className="p-5 lg:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
