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
          <h1 className="text-2xl font-display font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your products and orders</p>
        </div>
        <Link href="/seller/products/new" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow-sm transition-colors">
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📦', label: 'Total Products', value: products.length, color: 'from-emerald-50 to-green-50 border-emerald-100' },
          { icon: '✅', label: 'Active', value: active, color: 'from-green-50 to-lime-50 border-green-100' },
          { icon: '⏳', label: 'Pending Approval', value: pending, color: 'from-amber-50 to-yellow-50 border-amber-100' },
          { icon: '💰', label: 'Revenue', value: `₹${revenue.toLocaleString()}`, color: 'from-blue-50 to-indigo-50 border-blue-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border bg-gradient-to-br p-5 ${s.color}`}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-display font-bold text-gray-900 mt-2">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold text-gray-900">My Products</h2>
          <Link href="/seller/products" className="text-sm text-emerald-600 hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {products.slice(0, 5).map((p: any) => (
            <div key={p.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400">₹{p.price} · Stock: {p.stock}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : p.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {p.status?.replace('_', ' ')}
              </span>
            </div>
          ))}
          {products.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 mb-3">No products yet</p>
              <Link href="/seller/products/new" className="text-emerald-600 text-sm hover:underline">Create your first product →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
