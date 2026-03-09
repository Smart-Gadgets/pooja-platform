'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getMyProducts(0, 100).then(d => setProducts(d?.content || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products listed</p>
        </div>
        <Link href="/seller/products/new" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow-sm">
          + New Product
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center text-4xl">📦</div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : p.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                  {p.status?.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400">{p.category}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{p.name}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-emerald-600">₹{p.price}</span>
                <span className="text-xs text-gray-400">Stock: {p.stock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!loading && products.length === 0 && (
        <div className="py-20 text-center">
          <span className="text-5xl block mb-4">📦</span>
          <p className="text-gray-500 mb-4">You haven't listed any products yet</p>
          <Link href="/seller/products/new" className="px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">Create First Product</Link>
        </div>
      )}
    </div>
  );
}
