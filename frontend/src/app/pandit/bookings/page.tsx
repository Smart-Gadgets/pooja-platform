'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PanditBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    ordersApi.getBookings().then(d => setBookings(d?.content || d || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    try { await ordersApi.updateBookingStatus(id, status); toast.success('Booking updated'); load(); }
    catch { toast.error('Failed'); }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 mt-1">{bookings.length} total bookings</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {f === 'ALL' ? 'All' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((b: any) => (
          <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">{b.poojaType || b.ceremonyType}</p>
              <p className="text-xs text-gray-400 mt-1">{b.bookingDate || b.date} at {b.bookingTime || b.time || 'TBD'}</p>
              <p className="text-xs text-gray-400">{b.mode === 'VIRTUAL' ? '📹 Virtual' : '🏠 In-person'} · ₹{b.amount || 0}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : b.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
              {b.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(b.id, 'CONFIRMED')} className="px-3 py-1.5 rounded-xl bg-green-600 text-white text-xs hover:bg-green-700">Accept</button>
                  <button onClick={() => updateStatus(b.id, 'CANCELLED')} className="px-3 py-1.5 rounded-xl bg-red-100 text-red-600 text-xs hover:bg-red-200">Decline</button>
                </div>
              )}
              {b.status === 'CONFIRMED' && (
                <button onClick={() => updateStatus(b.id, 'COMPLETED')} className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs hover:bg-blue-700">Complete</button>
              )}
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && <div className="py-16 text-center text-gray-400">No bookings found</div>}
      </div>
    </div>
  );
}
