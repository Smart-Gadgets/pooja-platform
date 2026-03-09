'use client';
import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PanditBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const load = () => ordersApi.getBookings().then(d => setBookings(d?.content || d || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const update = async (id: string, status: string) => { try { await ordersApi.updateBookingStatus(id, status); toast.success('Updated'); load(); } catch { toast.error('Failed'); } };
  const list = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Bookings</h1>
      <p className="text-gray-500 text-sm mb-6">{bookings.length} total bookings</p>
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium ${filter === f ? 'bg-amber-700 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>{f === 'ALL' ? 'All' : f}</button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((b: any) => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{b.poojaType || b.ceremonyType}</p>
              <p className="text-xs text-gray-400 mt-1">{b.bookingDate || b.date} at {b.bookingTime || b.time || 'TBD'} · {b.mode === 'VIRTUAL' ? '📹 Virtual' : '🏠 In-person'} · ₹{b.amount || 0}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : b.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' : b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
              {b.status === 'PENDING' && <><button onClick={() => update(b.id, 'CONFIRMED')} className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs">Accept</button><button onClick={() => update(b.id, 'CANCELLED')} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs">Decline</button></>}
              {b.status === 'CONFIRMED' && <button onClick={() => update(b.id, 'COMPLETED')} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs">Complete</button>}
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="p-16 text-center text-gray-400">No bookings</div>}
      </div>
    </div>
  );
}
