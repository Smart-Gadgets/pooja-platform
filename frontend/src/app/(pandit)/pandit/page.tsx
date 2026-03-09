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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Welcome to Pandit Portal</p>

      {!profile && (
        <div className="mb-8 p-8 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 text-center">
          <span className="text-4xl block mb-3">👤</span>
          <p className="font-medium text-gray-700 mb-2">Set up your profile to start receiving bookings</p>
          <Link href="/pandit/profile" className="inline-block px-6 py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700">Create Profile</Link>
        </div>
      )}

      {profile && !profile.verified && (
        <div className="mb-8 p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-3">
          <span className="text-xl">⏳</span><p className="text-sm text-amber-800">Profile pending admin verification</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📅', label: 'Upcoming', value: upcoming.length, color: 'border-blue-100' },
          { icon: '✅', label: 'Completed', value: completed.length, color: 'border-green-100' },
          { icon: '💰', label: 'Earnings', value: `₹${earnings.toLocaleString()}`, color: 'border-purple-100' },
          { icon: '⭐', label: 'Rating', value: profile?.averageRating?.toFixed(1) || '—', color: 'border-amber-100' },
        ].map(c => (
          <div key={c.label} className={`bg-white rounded-2xl border ${c.color} p-5`}>
            <span className="text-2xl">{c.icon}</span>
            <p className="text-2xl font-bold text-gray-900 mt-2">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between"><h2 className="font-semibold text-gray-900">Upcoming Bookings</h2><Link href="/pandit/bookings" className="text-sm text-amber-600 hover:underline">All →</Link></div>
        <div className="divide-y divide-gray-50">
          {upcoming.slice(0, 5).map((b: any) => (
            <div key={b.id} className="px-5 py-3 flex justify-between items-center">
              <div><p className="text-sm font-medium">{b.poojaType || b.ceremonyType}</p><p className="text-xs text-gray-400">{b.bookingDate || b.date} · {b.mode === 'VIRTUAL' ? '📹 Virtual' : '🏠 In-person'}</p></div>
              <div className="text-right"><p className="text-sm font-semibold">₹{b.amount || 0}</p><span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span></div>
            </div>
          ))}
          {upcoming.length === 0 && <div className="p-10 text-center text-gray-400 text-sm">No upcoming bookings</div>}
        </div>
      </div>
    </div>
  );
}
