'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { ordersApi, paymentsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, loadCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) loadCart();
  }, [isAuthenticated, loadCart]);

  const shipping = totalPrice >= 499 ? 0 : 49;
  const total = totalPrice + shipping;

  const handlePlaceOrder = async () => {
    if (!address.line1 || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all required address fields');
      return;
    }
    setLoading(true);
    try {
      const shippingAddress = `${address.line1}, ${address.line2 ? address.line2 + ', ' : ''}${address.city}, ${address.state} - ${address.pincode}`;
      const order = await ordersApi.createOrder({ shippingAddress, phone: address.phone });
      toast.success('Order placed successfully!');
      clearCart();
      router.push(`/orders`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <div className="card-flat p-6">
              <h2 className="font-display text-xl font-semibold text-burgundy-700 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Address Line 1 *</label>
                  <input type="text" value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})} placeholder="House/Flat number, Street" required className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Address Line 2</label>
                  <input type="text" value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})} placeholder="Landmark, Area" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">City *</label>
                    <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="City" required className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">State *</label>
                    <input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} placeholder="State" required className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Pincode *</label>
                    <input type="text" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} placeholder="560001" required className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-burgundy-600 mb-1.5 block">Phone</label>
                    <input type="tel" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} placeholder="+91 98765 43210" className="input-field" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-flat p-6 sticky top-24">
              <h3 className="font-display text-xl font-semibold text-burgundy-700 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-burgundy-500 truncate mr-2">{item.productName} x{item.quantity}</span>
                    <span className="text-burgundy-700 font-medium flex-shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="border-saffron-100 my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-burgundy-400">Subtotal</span>
                  <span className="text-burgundy-700">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-burgundy-400">Shipping</span>
                  <span className="text-green-600 font-medium">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <hr className="border-saffron-100" />
                <div className="flex justify-between">
                  <span className="font-medium text-burgundy-700">Total</span>
                  <span className="font-display text-2xl font-bold text-saffron-600">₹{total}</span>
                </div>
              </div>
              <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary w-full mt-6 !py-3.5">
                {loading ? 'Placing Order...' : `Pay ₹${total}`}
              </button>
              <p className="text-[10px] text-burgundy-400 text-center mt-3">
                Secured by Razorpay. Your payment information is encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
