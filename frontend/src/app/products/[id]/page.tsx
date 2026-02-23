'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/sampleData';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import type { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    productsApi.getById(id as string)
      .then((data) => setProduct(data))
      .catch(() => {
        const sample = SAMPLE_PRODUCTS.find((p) => p.id === id);
        if (sample) setProduct(sample);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    if (!product) return;
    try {
      await addItem(product.id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const getCategoryEmoji = (cat: string) => {
    return CATEGORIES.find((c) => c.id === cat)?.icon || '🙏';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl animate-float block">🪔</span>
          <p className="text-burgundy-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">🔍</span>
          <h2 className="font-display text-2xl font-bold text-burgundy-700">Product not found</h2>
          <Link href="/products" className="btn-primary mt-4">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-saffron-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-burgundy-400">
            <Link href="/" className="hover:text-saffron-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-saffron-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-burgundy-700 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-saffron-50 via-cream-100 to-temple-50 flex items-center justify-center border border-saffron-100 overflow-hidden">
              <span className="text-[140px]">{getCategoryEmoji(product.category)}</span>
            </div>
            {discount > 0 && (
              <span className="absolute top-4 left-4 px-4 py-2 bg-vermillion-500 text-white text-sm font-bold rounded-xl">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Details */}
          <div className="animate-fade-in">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag) => (
                <span key={tag} className="badge-saffron capitalize">{tag}</span>
              ))}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-burgundy-800 leading-tight">
              {product.name}
            </h1>

            {product.sellerName && (
              <p className="text-sm text-burgundy-400 mt-2">
                by <span className="font-medium text-temple-600">{product.sellerName}</span>
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < Math.floor(product.rating || 0) ? 'text-temple-400' : 'text-gray-200'}`}>★</span>
                ))}
              </div>
              <span className="text-sm font-medium text-burgundy-600">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mt-6">
              <span className="font-display text-4xl font-bold text-saffron-600">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="text-sm text-green-600 font-medium mb-1">You save ₹{product.originalPrice! - product.price}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-burgundy-500 leading-relaxed mt-6">{product.description}</p>

            {/* Stock */}
            <div className="mt-6 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border border-saffron-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-burgundy-600 hover:bg-saffron-50 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-3 font-medium text-burgundy-700 min-w-[50px] text-center border-x border-saffron-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-burgundy-600 hover:bg-saffron-50 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 !py-3.5 text-base"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-saffron-100">
              {[
                { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹499' },
                { icon: '✅', title: 'Authentic Products', desc: '100% genuine items' },
                { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
                { icon: '🔒', title: 'Secure Payment', desc: 'Razorpay protected' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-burgundy-700">{f.title}</p>
                    <p className="text-xs text-burgundy-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
