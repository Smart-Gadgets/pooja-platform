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
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🙏</span>
          <h1 className="font-display text-3xl font-bold text-burgundy-800">Create Account</h1>
          <p className="text-burgundy-400 mt-2">Join the Pooja Platform community</p>
        </div>

        <div className="card-flat p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" required className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" required className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" required className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">I am a</label>
              <select value={form.role} onChange={(e) => update('role', e.target.value)} className="input-field">
                <option value="CUSTOMER">Devotee / Customer</option>
                <option value="SELLER">Seller / Vendor</option>
                <option value="PANDIT">Pandit / Priest</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Password</label>
              <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 8 characters" required minLength={8} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repeat your password" required className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-burgundy-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-saffron-600 font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
