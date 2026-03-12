'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

const DEMO_PANDIT = { email: 'pandit@pooja.com', pw: 'pandit123' };

export default function PanditLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { login, register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      if (isRegister) {
        await register({ name, email, phone, password, role: 'PANDIT' });
        toast.success('Account created! Pending verification.');
      } else {
        await login(email, password);
        const { user } = useAuthStore.getState();
        if (user?.role !== 'PANDIT') { 
          toast.error('This portal is for pandits only. Please use the appropriate login portal for your role.'); 
          useAuthStore.getState().logout(); 
          return; 
        }
        toast.success('Namaste, Pandit ji!');
      }
      router.push('/pandit');
    } catch (err: any) { toast.error(err.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🙏</span>
          <h1 className="text-2xl font-bold text-amber-900">Pandit Portal</h1>
          <p className="text-amber-700/60 text-sm mt-1">Manage your spiritual services</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-amber-500/5 border border-amber-100 p-8">
          <div className="flex bg-amber-50 rounded-xl p-1 mb-6">
            <button onClick={() => setIsRegister(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isRegister ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500'}`}>Sign In</button>
            <button onClick={() => setIsRegister(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isRegister ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500'}`}>Register</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && <>
              <div><label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
            </>}
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 text-sm" /></div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-all disabled:opacity-50">
              {loading ? 'Please wait...' : isRegister ? 'Join as Pandit' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-amber-100">
            <p className="text-xs text-gray-500 mb-3">Demo pandit account</p>
            <button onClick={() => { setEmail(DEMO_PANDIT.email); setPassword(DEMO_PANDIT.pw); }}
              className="w-full py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs hover:bg-amber-100 transition-colors">
              🙏 Pandit Demo
              <br/>
              <span className="text-[10px] font-mono text-amber-700">{DEMO_PANDIT.email}</span>
            </button>
          </div>
        </div>

        {/* Navigation to other portals */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-medium text-amber-900 mb-3">Other portals:</p>
          <div className="space-y-2 text-xs">
            <Link href="/auth/login" className="block px-3 py-2 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-blue-900 font-medium transition-colors text-center">🙏 Customer Portal</Link>
            <Link href="/seller/login" className="block px-3 py-2 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-900 font-medium transition-colors text-center">🏪 Seller Portal</Link>
            <Link href="/admin/login" className="block px-3 py-2 rounded-lg bg-white border border-violet-200 hover:bg-violet-50 text-violet-900 font-medium transition-colors text-center">👑 Admin Portal</Link>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6"><Link href="/" className="hover:text-gray-600">← Back to Store</Link></p>
      </div>
    </div>
  );
}
