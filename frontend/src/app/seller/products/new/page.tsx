'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'POOJA_SAMAGRI', 'IDOLS_MURTIS', 'BOOKS_SCRIPTURES', 'INCENSE_DHOOP',
  'FLOWERS_GARLANDS', 'PRASAD_SWEETS', 'POOJA_THALI', 'DIYA_LAMPS',
  'SACRED_THREAD', 'HAVAN_MATERIAL', 'GEMSTONES_RUDRAKSHA',
  'FESTIVAL_SPECIAL', 'DAILY_ESSENTIALS', 'OTHER',
];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: 'POOJA_SAMAGRI', usageInstructions: '' });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      await productsApi.create({ name: form.name, description: form.description, price: parseFloat(form.price), stock: parseInt(form.stock), category: form.category, usageInstructions: form.usageInstructions });
      toast.success('Product submitted for approval!');
      router.push('/seller/products');
    } catch (err: any) { toast.error(err.message || 'Failed to create product'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Products are reviewed by admin before going live</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
          <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required placeholder="e.g. Complete Ganesh Puja Kit" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} placeholder="Describe your product..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
            <input type="number" value={form.price} onChange={e => update('price', e.target.value)} required min="1" step="0.01" placeholder="499" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock *</label>
            <input type="number" value={form.stock} onChange={e => update('stock', e.target.value)} required min="0" placeholder="100" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
          <select value={form.category} onChange={e => update('category', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm">
            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Usage Instructions</label>
          <textarea value={form.usageInstructions} onChange={e => update('usageInstructions', e.target.value)} rows={3} placeholder="How to use this product..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}
