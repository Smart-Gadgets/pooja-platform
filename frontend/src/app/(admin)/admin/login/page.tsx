'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await login(email, password);
      const { user } = useAuthStore.getState();
      if (user?.role !== 'ADMIN') { toast.error('Access denied. Admin only.'); useAuthStore.getState().logout(); setLoading(false); return; }
      toast.success('Welcome, Admin'); router.push('/admin');
    } catch (err: any) { toast.error(err.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">P</div>
          <h1 className="text-2xl font-bold text-white">Admin Console</h1>
          <p className="text-slate-400 text-sm mt-1">Pooja Platform Administration</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@pooja.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm" /></div>
            <div><label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm" /></div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50">
              {loading ? 'Authenticating...' : 'Sign In to Admin'}
            </button>
          </form>
          <button onClick={() => { setEmail('admin@pooja.com'); setPassword('admin123'); }}
            className="w-full mt-4 py-2.5 rounded-xl border border-slate-600 text-slate-400 text-xs hover:border-violet-500 hover:text-violet-400 transition-colors">
            Demo: admin@pooja.com / admin123
          </button>
        </div>
        <p className="text-center text-slate-500 text-xs mt-6"><a href="/" className="hover:text-slate-300">← Back to Store</a></p>
      </div>
    </div>
  );
}
