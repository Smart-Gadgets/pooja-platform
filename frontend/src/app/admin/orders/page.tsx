'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    ordersApi.getOrders().then(d => setOrders(d?.content || d || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    try { await ordersApi.updateOrderStatus(id, status); toast.success(`Order ${status.toLowerCase()}`); load(); }
    catch { toast.error('Failed to update'); }
  };

  const statusActions: Record<string, { label: string; next: string; color: string }[]> = {
    PENDING: [{ label: 'Confirm', next: 'CONFIRMED', color: 'bg-indigo-600 text-white hover:bg-indigo-700' }, { label: 'Cancel', next: 'CANCELLED', color: 'bg-red-100 text-red-600 hover:bg-red-200' }],
    CONFIRMED: [{ label: 'Ship', next: 'SHIPPED', color: 'bg-blue-600 text-white hover:bg-blue-700' }],
    SHIPPED: [{ label: 'Delivered', next: 'DELIVERED', color: 'bg-green-600 text-white hover:bg-green-700' }],
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-500 mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o: any) => (
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{o.orderNumber || `#${o.id?.substring(0, 8)}`}</p>
                    <p className="text-xs text-gray-400">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{o.total || o.totalAmount || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      o.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-700' : o.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      o.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {(statusActions[o.status] || []).map((a: any) => (
                        <button key={a.next} onClick={() => updateStatus(o.id, a.next)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shadow-sm ${a.color}`}>{a.label}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && orders.length === 0 && <div className="py-16 text-center text-gray-400">No orders yet</div>}
      </div>
    </div>
  );
}
