'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/pandits', label: 'Find Pandit' },
  { href: '/ai-assistant', label: 'AI Guide' },
  { href: '/about', label: 'About' },
  { href: '/docs', label: 'Docs' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'ADMIN': return '/admin';
      case 'SELLER': return '/seller';
      case 'PANDIT': return '/pandit';
      default: return '/orders';
    }
  };

  const getDashboardLabel = () => {
    switch (user?.role) {
      case 'ADMIN': return '👑 Admin Panel';
      case 'SELLER': return '🏪 Seller Portal';
      case 'PANDIT': return '🙏 Pandit Portal';
      default: return '📦 My Orders';
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-warm border-b border-saffron-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:animate-float">🙏</span>
            <div>
              <span className="font-display text-2xl font-bold text-burgundy-700 tracking-tight">Pooja</span>
              <span className="font-display text-2xl font-light text-temple-500">Platform</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href ? 'text-saffron-600 bg-saffron-50' : 'text-burgundy-600 hover:text-saffron-600 hover:bg-saffron-50/50'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/cart" className="relative p-2 rounded-lg text-burgundy-600 hover:bg-saffron-50 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-vermillion-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{totalItems}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-saffron-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-saffron flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-burgundy-700 max-w-[100px] truncate">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-warm-lg border border-saffron-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link href={getDashboardLink()} className="block px-4 py-2.5 text-sm font-medium text-burgundy-700 hover:bg-saffron-50">
                    {getDashboardLabel()}
                  </Link>
                  {user?.role === 'CUSTOMER' && (
                    <Link href="/orders" className="block px-4 py-2 text-sm text-burgundy-600 hover:bg-saffron-50">📦 My Orders</Link>
                  )}
                  <hr className="my-1 border-saffron-100" />
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-vermillion-600 hover:bg-vermillion-50">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="btn-ghost text-sm">Sign In</Link>
                <Link href="/auth/register" className="btn-primary text-sm !px-4 !py-2">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/cart" className="relative p-2">
              <svg className="w-6 h-6 text-burgundy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItems > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-vermillion-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-burgundy-600 hover:bg-saffron-50">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden bg-white border-t border-saffron-100 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? 'text-saffron-600 bg-saffron-50' : 'text-burgundy-600 hover:bg-saffron-50'}`}>
              {link.label}
            </Link>
          ))}
          <hr className="border-saffron-100 my-2" />
          {isAuthenticated ? (
            <>
              <Link href={getDashboardLink()} className="block px-4 py-3 rounded-lg text-sm font-semibold text-burgundy-700 hover:bg-saffron-50">
                {getDashboardLabel()}
              </Link>
              <button onClick={logout} className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-vermillion-600 hover:bg-vermillion-50">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/auth/login" className="btn-ghost flex-1 text-center text-sm">Sign In</Link>
              <Link href="/auth/register" className="btn-primary flex-1 text-center text-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
