'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'CUSTOMER' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
      const { user } = useAuthStore.getState();
      toast.success('Account created!');
      switch (user?.role) {
        case 'SELLER': router.push('/seller'); break;
        case 'PANDIT': router.push('/pandit'); break;
        default: router.push('/'); break;
      }
    } catch (err: any) { toast.error(err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };
  const u = (f: string, v: string) => setForm({ ...form, [f]: v });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-cream-50 to-saffron-50/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🙏</span>
          <h1 className="font-display text-3xl font-bold text-burgundy-800">Join Pooja Platform</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-saffron-500/5 border border-saffron-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <input type="text" value={form.name} onChange={e => u('name', e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-saffron-500 text-sm" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => u('email', e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-saffron-500 text-sm" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <input type="tel" value={form.phone} onChange={e => u('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-saffron-500 text-sm" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">I am a</label>
              <select value={form.role} onChange={e => u('role', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-saffron-500 text-sm">
                <option value="CUSTOMER">Devotee / Customer</option>
                <option value="SELLER">Seller / Vendor</option>
                <option value="PANDIT">Pandit / Priest</option>
              </select></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input type="password" value={form.password} onChange={e => u('password', e.target.value)} required minLength={8} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-saffron-500 text-sm" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => u('confirmPassword', e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-saffron-500 text-sm" /></div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 mt-2">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account? <Link href="/auth/login" className="text-saffron-600 font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
