'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

interface RoleSidebarProps {
  title: string;
  subtitle: string;
  accentColor: string;       // tailwind bg class e.g. 'bg-purple-600'
  accentColorLight: string;  // tailwind bg class e.g. 'bg-purple-50'
  accentText: string;        // tailwind text class e.g. 'text-purple-600'
  navItems: NavItem[];
}

export default function RoleSidebar({ title, subtitle, accentColor, accentColorLight, accentText, navItems }: RoleSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); router.push('/auth/login'); };

  const isActive = (href: string) => {
    if (href.endsWith('/admin') || href.endsWith('/seller') || href.endsWith('/pandit')) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200">
        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
        </svg>
      </button>

      {/* Overlay */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Header */}
        <div className={`p-4 border-b border-gray-100 ${collapsed ? 'text-center' : ''}`}>
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="text-2xl">🙏</span>
            {!collapsed && (
              <div>
                <span className="font-display text-lg font-bold text-burgundy-700">Pooja</span>
                <span className="font-display text-lg font-light text-temple-500">Platform</span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <div className={`mt-3 px-3 py-1.5 rounded-lg ${accentColorLight} inline-block`}>
              <span className={`text-xs font-semibold ${accentText}`}>{subtitle}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive(item.href)
                  ? `${accentColorLight} ${accentText} shadow-sm`
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-100 p-4">
          {!collapsed && user && (
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full ${accentColor} flex items-center justify-center text-white text-sm font-bold`}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Link href="/" className="flex-1 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 text-center transition-colors">
              🏠 Store
            </Link>
            <button onClick={handleLogout}
              className="flex-1 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 text-center transition-colors">
              ↪ Logout
            </button>
          </div>
        </div>

        {/* Collapse toggle — desktop only */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-gray-600 text-xs">
          {collapsed ? '→' : '←'}
        </button>
      </aside>
    </>
  );
}
