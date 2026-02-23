'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi, productsApi, panditsApi, ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';

// ─── Stat Card ───
function StatCard({ icon, label, value, sub, color = 'saffron' }: { icon: string; label: string; value: string | number; sub?: string; color?: string }) {
  const bgMap: Record<string, string> = {
    saffron: 'from-saffron-50 to-orange-50 border-saffron-200',
    green: 'from-green-50 to-emerald-50 border-green-200',
    blue: 'from-blue-50 to-indigo-50 border-blue-200',
    purple: 'from-purple-50 to-violet-50 border-purple-200',
    red: 'from-red-50 to-pink-50 border-red-200',
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${bgMap[color] || bgMap.saffron}`}>
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-display font-bold text-burgundy-800 mt-2">{value}</p>
      <p className="text-sm text-burgundy-500">{label}</p>
      {sub && <p className="text-xs text-burgundy-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Action Card ───
function ActionCard({ href, icon, label, desc }: { href: string; icon: string; label: string; desc: string }) {
  return (
    <Link href={href} className="card group p-5 text-center hover:border-temple-300">
      <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{icon}</span>
      <h3 className="font-display text-sm font-semibold text-burgundy-700">{label}</h3>
      <p className="text-[10px] text-burgundy-400 mt-0.5">{desc}</p>
    </Link>
  );
}

// ═══════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════
function AdminDashboard({ user }: { user: any }) {
  const [tab, setTab] = useState<'overview' | 'users' | 'products' | 'pandits' | 'orders'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [pandits, setPandits] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async (type: string) => {
    setLoading(true);
    try {
      if (type === 'users' || type === 'overview') {
        const data = await authApi.listUsers(0, 50);
        setUsers(data?.content || []);
      }
      if (type === 'products' || type === 'overview') {
        const data = await productsApi.getAll(0, 50);
        setProducts(data?.content || []);
      }
      if (type === 'pandits' || type === 'overview') {
        const data = await panditsApi.getAll(0, 50);
        setPandits(data?.content || []);
      }
      if (type === 'orders' || type === 'overview') {
        const data = await ordersApi.getOrders();
        setOrders(data?.content || data || []);
      }
    } catch {
      // API not available — use empty data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData('overview'); }, []);
  useEffect(() => { loadData(tab); }, [tab]);

  const handleApproveUser = async (userId: string) => {
    try {
      await authApi.approveUser(userId);
      toast.success('User approved');
      loadData('users');
    } catch { toast.error('Failed to approve user'); }
  };

  const handleApproveProduct = async (productId: string) => {
    try {
      await productsApi.approveProduct(productId);
      toast.success('Product approved');
      loadData('products');
    } catch { toast.error('Failed to approve product'); }
  };

  const handleRejectProduct = async (productId: string) => {
    try {
      await productsApi.rejectProduct(productId);
      toast.success('Product rejected');
      loadData('products');
    } catch { toast.error('Failed to reject product'); }
  };

  const handleVerifyPandit = async (panditId: string) => {
    try {
      await panditsApi.verifyPandit(panditId);
      toast.success('Pandit verified');
      loadData('pandits');
    } catch { toast.error('Failed to verify pandit'); }
  };

  const handleOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersApi.updateOrderStatus(orderId, status);
      toast.success(`Order ${status.toLowerCase()}`);
      loadData('orders');
    } catch { toast.error('Failed to update order'); }
  };

  const tabs = [
    { id: 'overview' as const, icon: '📊', label: 'Overview' },
    { id: 'users' as const, icon: '👥', label: 'Users' },
    { id: 'products' as const, icon: '📦', label: 'Products' },
    { id: 'pandits' as const, icon: '🙏', label: 'Pandits' },
    { id: 'orders' as const, icon: '🧾', label: 'Orders' },
  ];

  const pendingUsers = users.filter(u => u.status === 'PENDING_APPROVAL');
  const pendingProducts = products.filter(p => p.status === 'PENDING_APPROVAL');
  const unverifiedPandits = pandits.filter(p => !p.verified);

  return (
    <>
      {/* Admin Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-saffron-100 mb-8 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-gradient-saffron text-white shadow-md' : 'text-burgundy-500 hover:bg-saffron-50'}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-8"><span className="text-4xl animate-float">🪔</span></div>}

      {/* Overview Tab */}
      {tab === 'overview' && !loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="👥" label="Total Users" value={users.length} sub={`${pendingUsers.length} pending`} color="blue" />
            <StatCard icon="📦" label="Products" value={products.length} sub={`${pendingProducts.length} pending`} color="green" />
            <StatCard icon="🙏" label="Pandits" value={pandits.length} sub={`${unverifiedPandits.length} unverified`} color="purple" />
            <StatCard icon="🧾" label="Orders" value={orders.length} color="saffron" />
          </div>

          {/* Pending Actions */}
          {(pendingUsers.length > 0 || pendingProducts.length > 0 || unverifiedPandits.length > 0) && (
            <div className="card-flat p-6 mb-8 border-2 border-amber-200 bg-amber-50/50">
              <h3 className="font-display text-lg font-semibold text-amber-800 mb-4">⚠️ Pending Actions</h3>
              <div className="space-y-2 text-sm">
                {pendingUsers.length > 0 && (
                  <button onClick={() => setTab('users')} className="flex items-center justify-between w-full p-3 rounded-lg bg-white hover:bg-amber-50 transition-colors">
                    <span>👤 {pendingUsers.length} users awaiting approval</span><span className="text-amber-600">Review →</span>
                  </button>
                )}
                {pendingProducts.length > 0 && (
                  <button onClick={() => setTab('products')} className="flex items-center justify-between w-full p-3 rounded-lg bg-white hover:bg-amber-50 transition-colors">
                    <span>📦 {pendingProducts.length} products pending review</span><span className="text-amber-600">Review →</span>
                  </button>
                )}
                {unverifiedPandits.length > 0 && (
                  <button onClick={() => setTab('pandits')} className="flex items-center justify-between w-full p-3 rounded-lg bg-white hover:bg-amber-50 transition-colors">
                    <span>🙏 {unverifiedPandits.length} pandits need verification</span><span className="text-amber-600">Verify →</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Platform Quick Links */}
          <h3 className="font-display text-lg font-semibold text-burgundy-700 mb-4">Platform Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionCard href="/products" icon="🛍️" label="Storefront" desc="View public store" />
            <ActionCard href="/pandits" icon="🙏" label="Pandit Directory" desc="Public listing" />
            <ActionCard href="/ai-assistant" icon="🤖" label="AI Assistant" desc="Test AI chat" />
            <ActionCard href="/about" icon="ℹ️" label="About Page" desc="Public about" />
          </div>
        </>
      )}

      {/* Users Tab */}
      {tab === 'users' && !loading && (
        <div className="card-flat overflow-hidden">
          <div className="p-5 border-b border-saffron-100">
            <h3 className="font-display text-lg font-semibold text-burgundy-700">User Management ({users.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50">
                <tr>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">User</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Role</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-saffron-50">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-cream-50/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-burgundy-700">{u.fullName || u.name}</p>
                      <p className="text-burgundy-400 text-xs">{u.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'SELLER' ? 'bg-green-100 text-green-700' :
                        u.role === 'PANDIT' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        u.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>{u.status?.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-3">
                      {u.status === 'PENDING_APPROVAL' && (
                        <button onClick={() => handleApproveUser(u.id)} className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200 transition-colors">
                          ✓ Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-burgundy-400">No users found. Start the backend services to see real data.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && !loading && (
        <div className="card-flat overflow-hidden">
          <div className="p-5 border-b border-saffron-100">
            <h3 className="font-display text-lg font-semibold text-burgundy-700">Product Management ({products.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50">
                <tr>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Product</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Price</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Stock</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-saffron-50">
                {products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-cream-50/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-burgundy-700">{p.name}</p>
                      <p className="text-burgundy-400 text-xs">{p.category} · by {p.sellerName || 'Unknown'}</p>
                    </td>
                    <td className="px-5 py-3 font-medium text-burgundy-700">₹{p.price}</td>
                    <td className="px-5 py-3">{p.stock}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        p.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                        p.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{p.status?.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-3">
                      {p.status === 'PENDING_APPROVAL' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveProduct(p.id)} className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200">✓ Approve</button>
                          <button onClick={() => handleRejectProduct(p.id)} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200">✗ Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-burgundy-400">No products found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pandits Tab */}
      {tab === 'pandits' && !loading && (
        <div className="card-flat overflow-hidden">
          <div className="p-5 border-b border-saffron-100">
            <h3 className="font-display text-lg font-semibold text-burgundy-700">Pandit Verification ({pandits.length})</h3>
          </div>
          <div className="divide-y divide-saffron-50">
            {pandits.map((p: any) => (
              <div key={p.id} className="p-5 flex items-center justify-between hover:bg-cream-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-100 to-temple-100 flex items-center justify-center text-xl font-display font-bold text-burgundy-700">
                    {(p.name || 'P').charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-burgundy-700">{p.name}</p>
                    <p className="text-xs text-burgundy-400">{p.city}, {p.state} · {p.experienceYears || p.experience || 0} yrs experience</p>
                    <div className="flex gap-1 mt-1">
                      {(p.specializations || []).slice(0, 3).map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded-full bg-saffron-50 text-saffron-600 text-[10px]">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.verified ? (
                    <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">✓ Verified</span>
                  ) : (
                    <button onClick={() => handleVerifyPandit(p.id)} className="px-4 py-2 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors">
                      Verify Pandit
                    </button>
                  )}
                </div>
              </div>
            ))}
            {pandits.length === 0 && (
              <div className="px-5 py-12 text-center text-burgundy-400">No pandits found.</div>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && !loading && (
        <div className="card-flat overflow-hidden">
          <div className="p-5 border-b border-saffron-100">
            <h3 className="font-display text-lg font-semibold text-burgundy-700">Order Management ({orders.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-50">
                <tr>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Total</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-burgundy-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-saffron-50">
                {orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-cream-50/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-burgundy-700">{o.orderNumber || `#${o.id?.substring(0,8)}`}</p>
                      <p className="text-burgundy-400 text-xs">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</p>
                    </td>
                    <td className="px-5 py-3 font-medium text-burgundy-700">₹{o.total || o.totalAmount || 0}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        o.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-700' :
                        o.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      {o.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleOrderStatus(o.id, 'CONFIRMED')} className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs hover:bg-indigo-200">Confirm</button>
                          <button onClick={() => handleOrderStatus(o.id, 'CANCELLED')} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs hover:bg-red-200">Cancel</button>
                        </div>
                      )}
                      {o.status === 'CONFIRMED' && (
                        <button onClick={() => handleOrderStatus(o.id, 'SHIPPED')} className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs hover:bg-blue-200">Mark Shipped</button>
                      )}
                      {o.status === 'SHIPPED' && (
                        <button onClick={() => handleOrderStatus(o.id, 'DELIVERED')} className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs hover:bg-green-200">Mark Delivered</button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-burgundy-400">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════
// SELLER DASHBOARD
// ═══════════════════════════════════════════════════
function SellerDashboard({ user }: { user: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.getMyProducts(0, 50).catch(() => ({ content: [] })),
      ordersApi.getOrders().catch(() => ({ content: [] })),
    ]).then(([prods, ords]) => {
      setProducts(prods?.content || []);
      setOrders(ords?.content || ords || []);
    }).finally(() => setLoading(false));
  }, []);

  const activeProducts = products.filter(p => p.status === 'ACTIVE');
  const pendingProducts = products.filter(p => p.status === 'PENDING_APPROVAL');
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || o.totalAmount || 0), 0);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📦" label="Total Products" value={products.length} sub={`${activeProducts.length} active`} color="green" />
        <StatCard icon="⏳" label="Pending Approval" value={pendingProducts.length} color="saffron" />
        <StatCard icon="🧾" label="Total Orders" value={orders.length} color="blue" />
        <StatCard icon="💰" label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* My Products */}
        <div className="card-flat overflow-hidden">
          <div className="p-5 border-b border-saffron-100 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-burgundy-700">My Products</h3>
            <Link href="/products" className="text-sm text-saffron-600 hover:underline">Add New →</Link>
          </div>
          <div className="divide-y divide-saffron-50 max-h-80 overflow-y-auto">
            {products.slice(0, 10).map((p: any) => (
              <div key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-burgundy-700 text-sm">{p.name}</p>
                  <p className="text-burgundy-400 text-xs">₹{p.price} · Stock: {p.stock}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  p.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>{p.status?.replace('_', ' ')}</span>
              </div>
            ))}
            {products.length === 0 && !loading && (
              <div className="p-8 text-center text-burgundy-400 text-sm">
                No products yet. <Link href="/products" className="text-saffron-600 hover:underline">Create your first product</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card-flat overflow-hidden">
          <div className="p-5 border-b border-saffron-100">
            <h3 className="font-display text-lg font-semibold text-burgundy-700">Recent Orders</h3>
          </div>
          <div className="divide-y divide-saffron-50 max-h-80 overflow-y-auto">
            {orders.slice(0, 10).map((o: any) => (
              <div key={o.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-burgundy-700 text-sm">{o.orderNumber || `#${o.id?.substring(0,8)}`}</p>
                  <p className="text-burgundy-400 text-xs">₹{o.total || o.totalAmount || 0}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>{o.status}</span>
              </div>
            ))}
            {orders.length === 0 && !loading && (
              <div className="p-8 text-center text-burgundy-400 text-sm">No orders received yet.</div>
            )}
          </div>
        </div>
      </div>

      <h3 className="font-display text-lg font-semibold text-burgundy-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionCard href="/products" icon="➕" label="Add Product" desc="List a new item" />
        <ActionCard href="/orders" icon="📦" label="My Orders" desc="Manage orders" />
        <ActionCard href="/ai-assistant" icon="🤖" label="AI Guide" desc="Get suggestions" />
        <ActionCard href="/dashboard" icon="📊" label="Analytics" desc="Sales insights" />
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════
// PANDIT DASHBOARD
// ═══════════════════════════════════════════════════
function PanditDashboard({ user }: { user: any }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      panditsApi.getMyProfile().catch(() => null),
      ordersApi.getBookings().catch(() => ({ content: [] })),
    ]).then(([prof, bk]) => {
      setProfile(prof);
      setBookings(bk?.content || bk || []);
    }).finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const completed = bookings.filter(b => b.status === 'COMPLETED');
  const totalEarnings = bookings.filter(b => b.status === 'COMPLETED').reduce((s: number, b: any) => s + (b.amount || 0), 0);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📅" label="Upcoming Bookings" value={upcoming.length} color="blue" />
        <StatCard icon="✅" label="Completed" value={completed.length} color="green" />
        <StatCard icon="💰" label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} color="purple" />
        <StatCard icon="⭐" label="Rating" value={profile?.averageRating?.toFixed(1) || '—'} sub={`${profile?.reviewCount || 0} reviews`} color="saffron" />
      </div>

      {/* Profile Status */}
      <div className={`card-flat p-6 mb-8 ${profile?.verified ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-burgundy-700">Profile Status</h3>
            <p className="text-sm text-burgundy-400 mt-1">
              {profile ? (
                profile.verified
                  ? '✅ Your profile is verified and visible to devotees.'
                  : '⏳ Your profile is pending verification by the admin team.'
              ) : (
                '📝 You haven\'t created your pandit profile yet.'
              )}
            </p>
          </div>
          {!profile && (
            <Link href="/pandits" className="btn-primary text-sm">Create Profile</Link>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Upcoming Bookings */}
        <div className="card-flat overflow-hidden">
          <div className="p-5 border-b border-saffron-100">
            <h3 className="font-display text-lg font-semibold text-burgundy-700">Upcoming Bookings</h3>
          </div>
          <div className="divide-y divide-saffron-50 max-h-80 overflow-y-auto">
            {upcoming.map((b: any) => (
              <div key={b.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-burgundy-700 text-sm">{b.poojaType || b.ceremonyType}</p>
                    <p className="text-burgundy-400 text-xs">{b.bookingDate || b.date} at {b.bookingTime || b.time}</p>
                    <p className="text-burgundy-400 text-xs">{b.mode === 'VIRTUAL' ? '📹 Virtual' : '🏠 In-person'} · ₹{b.amount || 0}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>{b.status}</span>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && !loading && (
              <div className="p-8 text-center text-burgundy-400 text-sm">No upcoming bookings.</div>
            )}
          </div>
        </div>

        {/* Profile Preview */}
        <div className="card-flat p-6">
          <h3 className="font-display text-lg font-semibold text-burgundy-700 mb-4">Your Profile</h3>
          {profile ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-saffron flex items-center justify-center text-white text-xl font-bold">
                  {profile.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-semibold text-burgundy-700">{profile.name}</p>
                  <p className="text-xs text-burgundy-400">{profile.city}, {profile.state}</p>
                </div>
              </div>
              <p className="text-sm text-burgundy-500">{profile.bio?.substring(0, 150)}...</p>
              <div className="flex flex-wrap gap-1">
                {(profile.specializations || []).map((s: string) => (
                  <span key={s} className="px-2 py-1 rounded-full bg-saffron-50 text-saffron-600 text-xs">{s}</span>
                ))}
              </div>
              <div className="text-xs text-burgundy-400 space-y-1">
                <p>🗣️ Languages: {(profile.languages || []).join(', ')}</p>
                <p>📅 Experience: {profile.experienceYears || profile.experience} years</p>
                <p>💰 Base rate: ₹{profile.baseRate || profile.pricePerHour || '—'}</p>
              </div>
            </div>
          ) : (
            <p className="text-burgundy-400 text-sm">Profile not created yet.</p>
          )}
        </div>
      </div>

      <h3 className="font-display text-lg font-semibold text-burgundy-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionCard href="/pandits" icon="👤" label="Edit Profile" desc="Update your details" />
        <ActionCard href="/orders" icon="📅" label="All Bookings" desc="View booking history" />
        <ActionCard href="/ai-assistant" icon="🤖" label="AI Guide" desc="Research rituals" />
        <ActionCard href="/products" icon="🛍️" label="Browse Shop" desc="Recommend items" />
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════
// CUSTOMER DASHBOARD
// ═══════════════════════════════════════════════════
function CustomerDashboard({ user }: { user: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ordersApi.getOrders().catch(() => ({ content: [] })),
      ordersApi.getBookings().catch(() => ({ content: [] })),
    ]).then(([ords, bks]) => {
      setOrders(ords?.content || ords || []);
      setBookings(bks?.content || bks || []);
    }).finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const totalSpent = orders.reduce((s: number, o: any) => s + (o.total || o.totalAmount || 0), 0);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📦" label="Total Orders" value={orders.length} color="blue" />
        <StatCard icon="🚚" label="Active Orders" value={activeOrders.length} color="saffron" />
        <StatCard icon="📅" label="Bookings" value={bookings.length} color="purple" />
        <StatCard icon="💰" label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} color="green" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Orders */}
        <div className="card-flat overflow-hidden">
          <div className="p-5 border-b border-saffron-100 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-burgundy-700">Recent Orders</h3>
            <Link href="/orders" className="text-sm text-saffron-600 hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-saffron-50 max-h-72 overflow-y-auto">
            {orders.slice(0, 5).map((o: any) => (
              <div key={o.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-burgundy-700 text-sm">{o.orderNumber || `Order #${o.id?.substring(0,8)}`}</p>
                  <p className="text-burgundy-400 text-xs">₹{o.total || o.totalAmount} · {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{o.status}</span>
              </div>
            ))}
            {orders.length === 0 && !loading && (
              <div className="p-8 text-center text-burgundy-400 text-sm">
                No orders yet. <Link href="/products" className="text-saffron-600 hover:underline">Start shopping!</Link>
              </div>
            )}
          </div>
        </div>

        {/* Bookings */}
        <div className="card-flat overflow-hidden">
          <div className="p-5 border-b border-saffron-100 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-burgundy-700">My Bookings</h3>
            <Link href="/orders" className="text-sm text-saffron-600 hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-saffron-50 max-h-72 overflow-y-auto">
            {bookings.slice(0, 5).map((b: any) => (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-burgundy-700 text-sm">{b.poojaType || b.ceremonyType}</p>
                  <p className="text-burgundy-400 text-xs">{b.panditName} · {b.bookingDate || b.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  b.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{b.status}</span>
              </div>
            ))}
            {bookings.length === 0 && !loading && (
              <div className="p-8 text-center text-burgundy-400 text-sm">
                No bookings yet. <Link href="/pandits" className="text-saffron-600 hover:underline">Book a pandit!</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="font-display text-lg font-semibold text-burgundy-700 mb-4">Explore</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ActionCard href="/products" icon="🛍️" label="Shop" desc="Browse products" />
        <ActionCard href="/pandits" icon="🙏" label="Pandits" desc="Find a priest" />
        <ActionCard href="/ai-assistant" icon="🤖" label="AI Guide" desc="Ask about rituals" />
        <ActionCard href="/cart" icon="🛒" label="Cart" desc="View your cart" />
        <ActionCard href="/orders" icon="📦" label="Orders" desc="Track orders" />
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ═══════════════════════════════════════════════════
export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, loadUser, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => { loadUser(); }, [loadUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <span className="text-5xl animate-float">🪔</span>
      </div>
    );
  }

  const roleLabel: Record<string, string> = {
    ADMIN: '👑 Platform Admin',
    SELLER: '🏪 Seller Account',
    PANDIT: '🙏 Pandit Account',
    CUSTOMER: '🪷 Devotee Account',
    MANAGER: '📋 Manager Account',
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="card-flat p-8 bg-gradient-to-br from-burgundy-800 to-burgundy-900 text-white mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-saffron flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold">Namaste, {user.name}!</h1>
              <p className="text-saffron-200/70 mt-1">{user.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white/10 text-sm text-saffron-100">
                {roleLabel[user.role] || user.role}
              </span>
            </div>
            <button onClick={logout} className="px-4 py-2 rounded-lg border border-white/20 text-sm text-white/80 hover:bg-white/10 transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        {/* Role-based Dashboard */}
        {user.role === 'ADMIN' && <AdminDashboard user={user} />}
        {user.role === 'SELLER' && <SellerDashboard user={user} />}
        {user.role === 'PANDIT' && <PanditDashboard user={user} />}
        {(user.role === 'CUSTOMER' || !['ADMIN', 'SELLER', 'PANDIT'].includes(user.role)) && <CustomerDashboard user={user} />}
      </div>
    </div>
  );
}
