'use client';

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    productsApi.getAll(0, 100).then(d => setProducts(d?.content || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const approve = async (id: string) => {
    try { await productsApi.approveProduct(id); toast.success('Product approved'); load(); }
    catch { toast.error('Failed'); }
  };
  const reject = async (id: string) => {
    try { await productsApi.rejectProduct(id); toast.success('Product rejected'); load(); }
    catch { toast.error('Failed'); }
  };

  const filtered = filter === 'ALL' ? products : products.filter(p => p.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Product Approval</h1>
        <p className="text-gray-500 mt-1">Review and approve seller products</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'PENDING_APPROVAL', 'ACTIVE', 'REJECTED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-200'}`}>
            {f === 'ALL' ? `All (${products.length})` : `${f.replace('_', ' ')} (${products.filter(p => p.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((p: any) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-saffron-50 to-amber-50 flex items-center justify-center text-2xl">📦</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.category} · by {p.sellerName || 'Unknown'} · ₹{p.price}</p>
                <p className="text-xs text-gray-400">Stock: {p.stock}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                p.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'}`}>{p.status?.replace('_', ' ')}</span>
              {p.status === 'PENDING_APPROVAL' && (
                <div className="flex gap-2">
                  <button onClick={() => approve(p.id)} className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-medium hover:bg-green-700 shadow-sm">✓ Approve</button>
                  <button onClick={() => reject(p.id)} className="px-4 py-2 rounded-xl bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200">✗ Reject</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && <div className="py-16 text-center text-gray-400">No products found</div>}
      </div>
    </div>
  );
}
