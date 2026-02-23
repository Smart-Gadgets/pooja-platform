'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

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
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🪔</span>
          <h1 className="font-display text-3xl font-bold text-burgundy-800">Welcome Back</h1>
          <p className="text-burgundy-400 mt-2">Sign in to your Pooja Platform account</p>
        </div>

        <div className="card-flat p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-burgundy-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-saffron-600 font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-saffron-100">
            <p className="text-xs text-burgundy-400 text-center mb-2">Demo credentials:</p>
            <button
              type="button"
              onClick={() => { setEmail('admin@pooja.com'); setPassword('admin123'); }}
              className="w-full px-3 py-2 rounded-lg bg-saffron-50 text-xs text-saffron-600 font-mono hover:bg-saffron-100 transition-colors"
            >
              admin@pooja.com / admin123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
