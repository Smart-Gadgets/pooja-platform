'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authApi, productsApi, panditsApi, ordersApi } from '@/lib/api';

function StatCard({ icon, label, value, sub, href, color }: any) {
  const colors: Record<string, string> = {
    indigo: 'from-indigo-500 to-indigo-600', green: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600', blue: 'from-blue-500 to-blue-600',
  };
  return (
    <Link href={href || '#'} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] bg-gradient-to-br ${colors[color] || colors.indigo} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <span className="text-3xl">{icon}</span>
      <p className="mt-3 text-3xl font-display font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, pandits: 0, orders: 0, pendingUsers: 0, pendingProducts: 0, unverifiedPandits: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      authApi.listUsers(0, 100).catch(() => ({ content: [] })),
      productsApi.getAll(0, 100).catch(() => ({ content: [] })),
      panditsApi.getAll(0, 100).catch(() => ({ content: [] })),
      ordersApi.getOrders().catch(() => ({ content: [] })),
    ]).then(([u, p, pd, o]) => {
      const users = u?.content || [];
      const products = p?.content || [];
      const pandits = pd?.content || [];
      const orders = o?.content || o || [];
      setStats({
        users: users.length, products: products.length, pandits: pandits.length, orders: orders.length,
        pendingUsers: users.filter((x: any) => x.status === 'PENDING_APPROVAL').length,
        pendingProducts: products.filter((x: any) => x.status === 'PENDING_APPROVAL').length,
        unverifiedPandits: pandits.filter((x: any) => !x.verified).length,
      });
      setRecentOrders(orders.slice(0, 5));
    });
  }, []);

  const alerts = [
    stats.pendingUsers > 0 && { icon: '👤', text: `${stats.pendingUsers} users awaiting approval`, href: '/admin/users', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    stats.pendingProducts > 0 && { icon: '📦', text: `${stats.pendingProducts} products pending review`, href: '/admin/products', color: 'bg-orange-50 text-orange-800 border-orange-200' },
    stats.unverifiedPandits > 0 && { icon: '🙏', text: `${stats.unverifiedPandits} pandits need verification`, href: '/admin/pandits', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  ].filter(Boolean);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and management</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-8 space-y-2">
          {alerts.map((a: any, i) => (
            <Link key={i} href={a.href} className={`flex items-center justify-between p-4 rounded-xl border ${a.color} hover:opacity-80 transition-opacity`}>
              <span className="text-sm font-medium">{a.icon} {a.text}</span>
              <span className="text-sm">Review →</span>
            </Link>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Total Users" value={stats.users} sub={`${stats.pendingUsers} pending`} href="/admin/users" color="indigo" />
        <StatCard icon="📦" label="Products" value={stats.products} sub={`${stats.pendingProducts} pending`} href="/admin/products" color="green" />
        <StatCard icon="🙏" label="Pandits" value={stats.pandits} sub={`${stats.unverifiedPandits} unverified`} href="/admin/pandits" color="amber" />
        <StatCard icon="🧾" label="Orders" value={stats.orders} href="/admin/orders" color="blue" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map((o: any) => (
            <div key={o.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{o.orderNumber || `#${o.id?.substring(0, 8)}`}</p>
                <p className="text-xs text-gray-400">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">₹{o.total || o.totalAmount || 0}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'}`}>{o.status}</span>
              </div>
            </div>
          ))}
          {recentOrders.length === 0 && <div className="px-6 py-12 text-center text-gray-400 text-sm">No orders yet</div>}
        </div>
      </div>
    </div>
  );
}
