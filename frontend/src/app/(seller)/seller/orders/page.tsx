'use client';
import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { ordersApi.getOrders().then(d => setOrders(d?.content || d || [])).catch(() => {}); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders Received</h1>
      <p className="text-gray-500 text-sm mb-6">{orders.length} orders</p>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {orders.map((o: any) => (
            <div key={o.id} className="p-5 flex justify-between items-center">
              <div><p className="text-sm font-semibold">{o.orderNumber || `#${o.id?.substring(0,8)}`}</p><p className="text-xs text-gray-400">{o.items?.length || 0} items · {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</p></div>
              <div className="text-right"><p className="text-lg font-bold">₹{o.total || o.totalAmount || 0}</p><span className={`px-2 py-0.5 rounded-full text-xs ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span></div>
            </div>
          ))}
          {orders.length === 0 && <div className="p-12 text-center text-gray-400">No orders yet</div>}
        </div>
      </div>
    </div>
  );
}
