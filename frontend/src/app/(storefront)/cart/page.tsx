'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function CartPage() {
  const { items, totalItems, totalPrice, isLoading, loadCart, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) loadCart();
  }, [isAuthenticated, loadCart]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">🛒</span>
          <h2 className="font-display text-2xl font-bold text-burgundy-700">Sign in to view your cart</h2>
          <Link href="/auth/login" className="btn-primary mt-4">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🛒</span>
            <h2 className="font-display text-2xl font-semibold text-burgundy-700">Your cart is empty</h2>
            <p className="text-burgundy-400 mt-2">Browse our collection and add items to your cart</p>
            <Link href="/products" className="btn-primary mt-6">Shop Now</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card-flat p-5 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-saffron-50 to-cream-100 flex items-center justify-center text-3xl flex-shrink-0">
                    🪔
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold text-burgundy-700 truncate">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-burgundy-400">Qty: {item.quantity}</p>
                    <p className="font-display text-lg font-bold text-saffron-600 mt-1">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-burgundy-400 hover:text-vermillion-500 hover:bg-vermillion-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card-flat p-6 sticky top-24">
                <h3 className="font-display text-xl font-semibold text-burgundy-700 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-burgundy-400">Items ({totalItems})</span>
                    <span className="text-burgundy-700">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-burgundy-400">Shipping</span>
                    <span className="text-green-600 font-medium">{totalPrice >= 499 ? 'Free' : '₹49'}</span>
                  </div>
                  <hr className="border-saffron-100" />
                  <div className="flex justify-between">
                    <span className="font-medium text-burgundy-700">Total</span>
                    <span className="font-display text-2xl font-bold text-saffron-600">
                      ₹{totalPrice + (totalPrice >= 499 ? 0 : 49)}
                    </span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-primary w-full text-center">
                  Proceed to Checkout
                </Link>
                <Link href="/products" className="btn-ghost w-full text-center text-sm mt-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
