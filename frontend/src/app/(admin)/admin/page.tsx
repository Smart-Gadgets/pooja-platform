'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authApi, productsApi, panditsApi, ordersApi } from '@/lib/api';

export default function AdminDashboard() {
  const [s, setS] = useState({ users: 0, products: 0, pandits: 0, orders: 0, pu: 0, pp: 0, up: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      authApi.listUsers(0, 200).catch(() => ({ content: [] })),
      productsApi.getAll(0, 200).catch(() => ({ content: [] })),
      panditsApi.getAll(0, 200).catch(() => ({ content: [] })),
      ordersApi.getOrders().catch(() => ({ content: [] })),
    ]).then(([u, p, pd, o]) => {
      const users = u?.content || [], products = p?.content || [], pandits = pd?.content || [], orders = o?.content || o || [];
      setS({ users: users.length, products: products.length, pandits: pandits.length, orders: orders.length,
        pu: users.filter((x: any) => x.status === 'PENDING_APPROVAL').length,
        pp: products.filter((x: any) => x.status === 'PENDING_APPROVAL').length,
        up: pandits.filter((x: any) => !x.verified).length });
      setRecent(orders.slice(0, 5));
    });
  }, []);

  const alerts = [
    s.pu > 0 && { icon: '👤', text: `${s.pu} users pending approval`, href: '/admin/users' },
    s.pp > 0 && { icon: '📦', text: `${s.pp} products need review`, href: '/admin/products' },
    s.up > 0 && { icon: '🙏', text: `${s.up} pandits need verification`, href: '/admin/pandits' },
  ].filter(Boolean);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Platform overview</p>

      {alerts.length > 0 && (
        <div className="mb-8 space-y-2">
          {alerts.map((a: any, i) => (
            <Link key={i} href={a.href} className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm hover:bg-amber-100 transition-colors">
              <span>{a.icon} {a.text}</span><span className="font-medium">Review →</span>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '👥', label: 'Users', val: s.users, sub: `${s.pu} pending`, href: '/admin/users', bg: 'from-violet-500 to-indigo-600' },
          { icon: '📦', label: 'Products', val: s.products, sub: `${s.pp} pending`, href: '/admin/products', bg: 'from-emerald-500 to-teal-600' },
          { icon: '🙏', label: 'Pandits', val: s.pandits, sub: `${s.up} unverified`, href: '/admin/pandits', bg: 'from-amber-500 to-orange-600' },
          { icon: '🧾', label: 'Orders', val: s.orders, sub: 'total', href: '/admin/orders', bg: 'from-blue-500 to-indigo-600' },
        ].map(c => (
          <Link key={c.label} href={c.href} className="group rounded-2xl bg-white border border-slate-100 p-5 hover:shadow-lg transition-all overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-[3rem] bg-gradient-to-br ${c.bg} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <span className="text-2xl">{c.icon}</span>
            <p className="text-3xl font-bold text-slate-900 mt-2">{c.val}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="text-xs text-slate-400">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-violet-600 hover:underline">All orders →</Link>
        </div>
        <div className="divide-y divide-slate-50">
          {recent.map((o: any) => (
            <div key={o.id} className="px-5 py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-900">{o.orderNumber || `#${o.id?.substring(0, 8)}`}</p>
                <p className="text-xs text-slate-400">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">₹{o.total || o.totalAmount || 0}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
              </div>
            </div>
          ))}
          {recent.length === 0 && <div className="p-10 text-center text-slate-400 text-sm">No orders yet</div>}
        </div>
      </div>
    </div>
  );
}
