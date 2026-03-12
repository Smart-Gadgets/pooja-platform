'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

const DEMO_CUSTOMER = { email: 'customer@pooja.com', pw: 'customer123' };

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const { user } = useAuthStore.getState();
      // Validate that user is a customer
      if (user?.role !== 'CUSTOMER') {
        toast.error('This portal is for customers only. Please use the appropriate login portal for your role.');
        useAuthStore.getState().logout();
        return;
      }
      toast.success(`Welcome back, ${user?.name}!`);
      router.push('/');
    } catch (err: any) { toast.error(err.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-cream-50 to-saffron-50/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🪔</span>
          <h1 className="font-display text-3xl font-bold text-burgundy-800">Welcome Back</h1>
          <p className="text-burgundy-400 mt-2">Customer Portal - Sign in to continue shopping</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-saffron-500/5 border border-saffron-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-saffron-500 focus:border-transparent text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold hover:shadow-lg hover:shadow-saffron-500/20 transition-all disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            New here? <Link href="/auth/register" className="text-saffron-600 font-medium hover:underline">Create account</Link>
          </p>
        </div>

        {/* Demo account for customers only */}
        <div className="mt-8">
          <p className="text-center text-xs text-gray-400 mb-3">Demo customer account</p>
          <button onClick={() => { setEmail(DEMO_CUSTOMER.email); setPassword(DEMO_CUSTOMER.pw); }}
            className="w-full p-3 rounded-xl border border-blue-200 bg-blue-50 hover:border-blue-400 text-left transition-all">
            <span className="text-sm font-medium block">🙏 Customer Demo</span>
            <span className="text-[10px] text-gray-500 block mt-0.5">Shopping experience</span>
            <span className="text-[10px] font-mono text-gray-400 block mt-1">{DEMO_CUSTOMER.email}</span>
          </button>
        </div>

        {/* Navigation to other portals */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-medium text-amber-900 mb-3">Are you a...</p>
          <div className="space-y-2 text-sm">
            <Link href="/pandit/login" className="block px-3 py-2 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 text-amber-900 font-medium transition-colors text-center">🙏 Pandit? Go to Pandit Portal</Link>
            <Link href="/seller/login" className="block px-3 py-2 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-900 font-medium transition-colors text-center">🏪 Seller? Go to Seller Portal</Link>
            <Link href="/admin/login" className="block px-3 py-2 rounded-lg bg-white border border-violet-200 hover:bg-violet-50 text-violet-900 font-medium transition-colors text-center">👑 Admin? Go to Admin Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
