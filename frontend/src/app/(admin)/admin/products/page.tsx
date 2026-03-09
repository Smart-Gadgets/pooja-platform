'use client';
import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState('PENDING_APPROVAL');

  const load = () => productsApi.getAll(0, 200).then(d => setProducts(d?.content || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const approve = async (id: string) => { try { await productsApi.approveProduct(id); toast.success('Approved'); load(); } catch { toast.error('Failed'); } };
  const reject = async (id: string) => { try { await productsApi.rejectProduct(id); toast.success('Rejected'); load(); } catch { toast.error('Failed'); } };

  const list = filter === 'ALL' ? products : products.filter(p => p.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Product Approval</h1>
      <p className="text-slate-500 text-sm mb-6">Review seller product submissions</p>
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {['ALL', 'PENDING_APPROVAL', 'ACTIVE', 'REJECTED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs font-medium ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {f === 'ALL' ? `All (${products.length})` : `${f.replace('_', ' ')} (${products.filter(p => p.status === f).length})`}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">📦</div>
              <div>
                <p className="font-medium text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-400">{p.category} · ₹{p.price} · Stock: {p.stock} · by {p.sellerName || 'Unknown'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : p.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {p.status?.replace('_', ' ')}
              </span>
              {p.status === 'PENDING_APPROVAL' && <>
                <button onClick={() => approve(p.id)} className="px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700">✓ Approve</button>
                <button onClick={() => reject(p.id)} className="px-4 py-2 rounded-lg bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200">✗ Reject</button>
              </>}
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="p-16 text-center text-slate-400">No products</div>}
      </div>
    </div>
  );
}
