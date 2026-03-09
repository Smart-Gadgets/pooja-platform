'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getOrders().then(d => setOrders(d?.content || d || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Orders Received</h1>
        <p className="text-gray-500 mt-1">{orders.length} orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {orders.map((o: any) => (
            <div key={o.id} className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{o.orderNumber || `#${o.id?.substring(0, 8)}`}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {o.items?.length || 0} items · {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">₹{o.total || o.totalAmount || 0}</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
          {!loading && orders.length === 0 && <div className="py-16 text-center text-gray-400">No orders received yet</div>}
        </div>
      </div>
    </div>
  );
}
