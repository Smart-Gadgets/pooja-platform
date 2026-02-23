'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { ordersApi } from '@/lib/api';
import type { Order, Booking } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading, loadUser } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<'orders' | 'bookings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUser(); }, [loadUser]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setLoading(true);
    Promise.all([
      ordersApi.getOrders().catch(() => []),
      ordersApi.getBookings().catch(() => []),
    ]).then(([o, b]) => {
      setOrders(Array.isArray(o) ? o : o?.content || []);
      setBookings(Array.isArray(b) ? b : b?.content || []);
    }).finally(() => setLoading(false));
  }, [isAuthenticated, authLoading, router]);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-2">My Orders & Bookings</h1>
        <p className="section-subtitle mb-8">Track your purchases and ceremony bookings</p>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-saffron-100 w-fit mb-8">
          <button
            onClick={() => setTab('orders')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'orders' ? 'bg-saffron-500 text-white' : 'text-burgundy-500 hover:bg-saffron-50'
            }`}
          >
            Product Orders
          </button>
          <button
            onClick={() => setTab('bookings')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'bookings' ? 'bg-saffron-500 text-white' : 'text-burgundy-500 hover:bg-saffron-50'
            }`}
          >
            Pandit Bookings
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-flat p-6">
                <div className="h-5 w-1/3 shimmer rounded mb-3" />
                <div className="h-4 w-2/3 shimmer rounded mb-2" />
                <div className="h-4 w-1/4 shimmer rounded" />
              </div>
            ))}
          </div>
        ) : tab === 'orders' ? (
          orders.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4">📦</span>
              <h2 className="font-display text-2xl font-semibold text-burgundy-700">No orders yet</h2>
              <p className="text-burgundy-400 mt-2">Start shopping to see your orders here</p>
              <Link href="/products" className="btn-primary mt-6">Shop Now</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="card-flat p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-burgundy-400">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-burgundy-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                      <span className={`badge ${STATUS_COLORS[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>Payment: {order.paymentStatus}</span>
                    </div>
                  </div>
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-t border-saffron-50">
                      <div>
                        <p className="text-sm font-medium text-burgundy-700">{item.productName}</p>
                        <p className="text-xs text-burgundy-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-burgundy-700">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t border-saffron-100 mt-2">
                    <span className="text-sm text-burgundy-400">Shipping: {order.shippingAddress}</span>
                    <span className="font-display text-xl font-bold text-saffron-600">₹{order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          bookings.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4">🙏</span>
              <h2 className="font-display text-2xl font-semibold text-burgundy-700">No bookings yet</h2>
              <p className="text-burgundy-400 mt-2">Book a pandit for your next ceremony</p>
              <Link href="/pandits" className="btn-primary mt-6">Find a Pandit</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="card-flat p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-burgundy-700">{booking.ceremonyType}</h3>
                      <p className="text-sm text-burgundy-400">with {booking.panditName}</p>
                    </div>
                    <span className={`badge ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-700'}`}>{booking.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-burgundy-500">
                    <span>📅 {booking.date}</span>
                    <span>🕐 {booking.time}</span>
                    <span>{booking.mode === 'VIRTUAL' ? '💻 Virtual' : '📍 In-Person'}</span>
                    <span className="font-display font-bold text-saffron-600">₹{booking.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
