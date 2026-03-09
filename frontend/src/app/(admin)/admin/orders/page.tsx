'use client';
import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const load = () => ordersApi.getOrders().then(d => setOrders(d?.content || d || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const update = async (id: string, status: string) => { try { await ordersApi.updateOrderStatus(id, status); toast.success('Updated'); load(); } catch { toast.error('Failed'); } };

  const actions: Record<string, any[]> = {
    PENDING: [{ l: 'Confirm', s: 'CONFIRMED', c: 'bg-indigo-600 text-white' }, { l: 'Cancel', s: 'CANCELLED', c: 'bg-red-100 text-red-600' }],
    CONFIRMED: [{ l: 'Ship', s: 'SHIPPED', c: 'bg-blue-600 text-white' }],
    SHIPPED: [{ l: 'Delivered', s: 'DELIVERED', c: 'bg-green-600 text-white' }],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Order Management</h1>
      <p className="text-slate-500 text-sm mb-6">{orders.length} orders</p>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50"><tr>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Order</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((o: any) => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3"><p className="text-sm font-medium">{o.orderNumber || `#${o.id?.substring(0,8)}`}</p><p className="text-xs text-slate-400">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</p></td>
                <td className="px-5 py-3 text-sm font-semibold">₹{o.total || o.totalAmount || 0}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : o.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span></td>
                <td className="px-5 py-3 text-right"><div className="flex gap-1.5 justify-end">{(actions[o.status] || []).map((a: any) => <button key={a.s} onClick={() => update(o.id, a.s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${a.c}`}>{a.l}</button>)}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="p-12 text-center text-slate-400">No orders</div>}
      </div>
    </div>
  );
}
