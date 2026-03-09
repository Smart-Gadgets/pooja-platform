'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/sampleData';
import { productsApi } from '@/lib/api';

export default function HomePage() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  useEffect(() => {
    productsApi.getFeatured().then((d: any) => { if (d?.content?.length) setProducts(d.content); }).catch(() => {});
  }, []);

  return (
    <div className="bg-cream-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-burgundy-800 via-burgundy-900 to-burgundy-950 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 relative">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-saffron-500/20 text-saffron-300 text-sm font-medium mb-6">🪔 India&apos;s Sacred Marketplace</span>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight">
              Your Spiritual<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-temple-300">Journey Starts Here</span>
            </h1>
            <p className="text-xl text-saffron-100/60 mt-6 max-w-lg">Authentic pooja items, verified pandits, and AI-powered ritual guidance — all in one place.</p>
            <div className="flex gap-4 mt-10">
              <Link href="/products" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold text-lg hover:shadow-xl hover:shadow-saffron-500/20 transition-all">Shop Now</Link>
              <Link href="/pandits" className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-all">Find Pandit</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-display text-3xl font-bold text-burgundy-800 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.id}`}
              className="group p-6 rounded-2xl bg-white border border-saffron-100 hover:border-saffron-300 hover:shadow-lg transition-all text-center">
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <p className="font-display font-semibold text-burgundy-700">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl font-bold text-burgundy-800">Featured Products</h2>
            <Link href="/products" className="text-saffron-600 hover:underline text-sm font-medium">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map(p => (
              <Link key={p.id} href={`/products/${p.id}`} className="group rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-saffron-50 to-cream-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">🪔</div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-burgundy-700 line-clamp-1">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-saffron-600">₹{p.price}</span>
                    <span className="text-xs text-green-600 font-medium">In Stock</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-saffron-500 to-temple-500 p-12 lg:p-16 text-center text-white">
          <h2 className="font-display text-4xl font-bold">Not sure what you need?</h2>
          <p className="text-xl text-white/80 mt-4 max-w-lg mx-auto">Ask our AI Spiritual Guide for personalized recommendations on rituals, products, and more.</p>
          <Link href="/ai-assistant" className="inline-block mt-8 px-8 py-4 rounded-2xl bg-white text-saffron-600 font-semibold hover:shadow-xl transition-all">🤖 Try AI Guide</Link>
        </div>
      </section>
    </div>
  );
}
