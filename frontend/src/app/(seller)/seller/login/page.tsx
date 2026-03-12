'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

const DEMO_SELLER = { email: 'seller@pooja.com', pw: 'seller123' };

export default function SellerLoginPage() {
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
        await register({ name, email, phone, password, role: 'SELLER' });
        toast.success('Seller account created! Pending admin approval.');
      } else {
        await login(email, password);
        const { user } = useAuthStore.getState();
        if (user?.role !== 'SELLER') { 
          toast.error('This portal is for sellers only. Please use the appropriate login portal for your role.'); 
          useAuthStore.getState().logout(); 
          return; 
        }
        toast.success('Welcome to Seller Central');
      }
      router.push('/seller');
    } catch (err: any) { toast.error(err.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Central</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your products on Pooja Platform</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-500/5 border border-emerald-100 p-8">
          <div className="flex bg-emerald-50 rounded-xl p-1 mb-6">
            <button onClick={() => setIsRegister(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isRegister ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}>Sign In</button>
            <button onClick={() => setIsRegister(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isRegister ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'}`}>Register</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && <>
              <div><label className="text-sm font-medium text-gray-700 mb-1 block">Business Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
            </>}
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50">
              {loading ? 'Please wait...' : isRegister ? 'Create Seller Account' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-emerald-100">
            <p className="text-xs text-gray-500 mb-3">Demo seller account</p>
            <button onClick={() => { setEmail(DEMO_SELLER.email); setPassword(DEMO_SELLER.pw); }}
              className="w-full py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs hover:bg-emerald-100 transition-colors">
              🏪 Seller Demo
              <br/>
              <span className="text-[10px] font-mono text-emerald-700">{DEMO_SELLER.email}</span>
            </button>
          </div>
        </div>

        {/* Navigation to other portals */}
        <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-xs font-medium text-emerald-900 mb-3">Other portals:</p>
          <div className="space-y-2 text-xs">
            <Link href="/auth/login" className="block px-3 py-2 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-blue-900 font-medium transition-colors text-center">🙏 Customer Portal</Link>
            <Link href="/pandit/login" className="block px-3 py-2 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 text-amber-900 font-medium transition-colors text-center">🙏 Pandit Portal</Link>
            <Link href="/admin/login" className="block px-3 py-2 rounded-lg bg-white border border-violet-200 hover:bg-violet-50 text-violet-900 font-medium transition-colors text-center">👑 Admin Portal</Link>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6"><Link href="/" className="hover:text-gray-600">← Back to Store</Link></p>
      </div>
    </div>
  );
}
