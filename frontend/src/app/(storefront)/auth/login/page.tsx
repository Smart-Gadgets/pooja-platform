'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

const DEMOS = [
  { email: 'admin@pooja.com', pw: 'admin123', label: '👑 Admin', sub: 'Full platform control', color: 'border-violet-200 bg-violet-50 hover:border-violet-400' },
  { email: 'customer@pooja.com', pw: 'customer123', label: '🙏 Customer', sub: 'Shopping experience', color: 'border-blue-200 bg-blue-50 hover:border-blue-400' },
  { email: 'seller@pooja.com', pw: 'seller123', label: '🏪 Seller', sub: 'Product management', color: 'border-emerald-200 bg-emerald-50 hover:border-emerald-400' },
  { email: 'pandit@pooja.com', pw: 'pandit123', label: '🙏 Pandit', sub: 'Booking management', color: 'border-amber-200 bg-amber-50 hover:border-amber-400' },
];

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
      toast.success(`Welcome back, ${user?.name}!`);
      switch (user?.role) {
        case 'ADMIN': router.push('/admin'); break;
        case 'SELLER': router.push('/seller'); break;
        case 'PANDIT': router.push('/pandit'); break;
        default: router.push('/'); break;
      }
    } catch (err: any) { toast.error(err.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-cream-50 to-saffron-50/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🪔</span>
          <h1 className="font-display text-3xl font-bold text-burgundy-800">Welcome Back</h1>
          <p className="text-burgundy-400 mt-2">Sign in to continue</p>
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

        {/* Demo accounts */}
        <div className="mt-8">
          <p className="text-center text-xs text-gray-400 mb-3">Quick login — tap to fill credentials</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMOS.map(d => (
              <button key={d.email} onClick={() => { setEmail(d.email); setPassword(d.pw); }}
                className={`p-3 rounded-xl border text-left transition-all ${d.color}`}>
                <span className="text-sm font-medium block">{d.label}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">{d.sub}</span>
                <span className="text-[10px] font-mono text-gray-400 block mt-1">{d.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
