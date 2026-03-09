'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { panditsApi, ordersApi } from '@/lib/api';

export default function PanditDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    panditsApi.getMyProfile().then(setProfile).catch(() => {});
    ordersApi.getBookings().then(d => setBookings(d?.content || d || [])).catch(() => {});
  }, []);

  const upcoming = bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status));
  const completed = bookings.filter(b => b.status === 'COMPLETED');
  const earnings = completed.reduce((s: number, b: any) => s + (b.amount || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Pandit Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your bookings and profile</p>
      </div>

      {/* Profile Status */}
      {!profile && (
        <div className="mb-8 p-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 text-center">
          <span className="text-4xl block mb-3">👤</span>
          <p className="text-gray-700 font-medium mb-2">Complete your profile to start receiving bookings</p>
          <Link href="/pandit/profile" className="inline-block px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700">Create Profile</Link>
        </div>
      )}

      {profile && !profile.verified && (
        <div className="mb-8 p-4 rounded-2xl border border-amber-200 bg-amber-50 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <p className="text-sm text-amber-800">Your profile is pending verification. Admin will review it shortly.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📅', label: 'Upcoming', value: upcoming.length, color: 'from-blue-50 to-indigo-50 border-blue-100' },
          { icon: '✅', label: 'Completed', value: completed.length, color: 'from-green-50 to-emerald-50 border-green-100' },
          { icon: '💰', label: 'Earnings', value: `₹${earnings.toLocaleString()}`, color: 'from-purple-50 to-violet-50 border-purple-100' },
          { icon: '⭐', label: 'Rating', value: profile?.averageRating?.toFixed(1) || '—', color: 'from-amber-50 to-yellow-50 border-amber-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border bg-gradient-to-br p-5 ${s.color}`}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-display font-bold text-gray-900 mt-2">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold text-gray-900">Upcoming Bookings</h2>
          <Link href="/pandit/bookings" className="text-sm text-amber-600 hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {upcoming.slice(0, 5).map((b: any) => (
            <div key={b.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{b.poojaType || b.ceremonyType}</p>
                <p className="text-xs text-gray-400">{b.bookingDate || b.date} · {b.mode === 'VIRTUAL' ? '📹 Virtual' : '🏠 In-person'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">₹{b.amount || 0}</p>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && <div className="px-6 py-12 text-center text-gray-400 text-sm">No upcoming bookings</div>}
        </div>
      </div>
    </div>
  );
}
