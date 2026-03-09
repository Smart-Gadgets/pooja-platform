'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsApi, ordersApi } from '@/lib/api';

export default function SellerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    productsApi.getMyProducts(0, 50).then(d => setProducts(d?.content || [])).catch(() => {});
    ordersApi.getOrders().then(d => setOrders(d?.content || d || [])).catch(() => {});
  }, []);

  const active = products.filter(p => p.status === 'ACTIVE').length;
  const pending = products.filter(p => p.status === 'PENDING_APPROVAL').length;
  const revenue = orders.reduce((s: number, o: any) => s + (o.total || o.totalAmount || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome to Seller Central</p>
        </div>
        <Link href="/seller/products/new" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow-sm">+ Add Product</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📦', label: 'Products', value: products.length, sub: `${active} active, ${pending} pending`, color: 'border-emerald-100' },
          { icon: '🧾', label: 'Orders', value: orders.length, color: 'border-blue-100' },
          { icon: '💰', label: 'Revenue', value: `₹${revenue.toLocaleString()}`, color: 'border-purple-100' },
          { icon: '⭐', label: 'Rating', value: '4.8', sub: '23 reviews', color: 'border-amber-100' },
        ].map(c => (
          <div key={c.label} className={`bg-white rounded-2xl border ${c.color} p-5`}>
            <span className="text-2xl">{c.icon}</span>
            <p className="text-2xl font-bold text-gray-900 mt-2">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
            {c.sub && <p className="text-xs text-gray-400">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between"><h2 className="font-semibold text-gray-900">Recent Products</h2><Link href="/seller/products" className="text-sm text-emerald-600 hover:underline">All →</Link></div>
          <div className="divide-y divide-gray-50">
            {products.slice(0, 5).map((p: any) => (
              <div key={p.id} className="px-5 py-3 flex justify-between items-center">
                <div><p className="text-sm font-medium text-gray-900">{p.name}</p><p className="text-xs text-gray-400">₹{p.price} · Stock: {p.stock}</p></div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{p.status?.replace('_', ' ')}</span>
              </div>
            ))}
            {products.length === 0 && <div className="p-10 text-center text-gray-400 text-sm">No products — <Link href="/seller/products/new" className="text-emerald-600">create one</Link></div>}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between"><h2 className="font-semibold text-gray-900">Recent Orders</h2><Link href="/seller/orders" className="text-sm text-emerald-600 hover:underline">All →</Link></div>
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 5).map((o: any) => (
              <div key={o.id} className="px-5 py-3 flex justify-between items-center">
                <div><p className="text-sm font-medium">{o.orderNumber || `#${o.id?.substring(0,8)}`}</p><p className="text-xs text-gray-400">{o.items?.length || 0} items</p></div>
                <p className="text-sm font-semibold">₹{o.total || o.totalAmount || 0}</p>
              </div>
            ))}
            {orders.length === 0 && <div className="p-10 text-center text-gray-400 text-sm">No orders yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
