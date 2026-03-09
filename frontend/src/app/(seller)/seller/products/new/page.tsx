'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api';
import toast from 'react-hot-toast';

const CATS = ['POOJA_SAMAGRI','IDOLS_MURTIS','BOOKS_SCRIPTURES','INCENSE_DHOOP','FLOWERS_GARLANDS','PRASAD_SWEETS','POOJA_THALI','DIYA_LAMPS','SACRED_THREAD','HAVAN_MATERIAL','GEMSTONES_RUDRAKSHA','FESTIVAL_SPECIAL','DAILY_ESSENTIALS','OTHER'];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: '', description: '', price: '', stock: '', category: 'POOJA_SAMAGRI', usageInstructions: '' });
  const u = (k: string, v: string) => setF({ ...f, [k]: v });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productsApi.create({ name: f.name, description: f.description, price: parseFloat(f.price), stock: parseInt(f.stock), category: f.category, usageInstructions: f.usageInstructions });
      toast.success('Product submitted for approval!');
      router.push('/seller/products');
    } catch (err: any) { toast.error(err.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Product</h1>
      <p className="text-gray-500 text-sm mb-8">Products are reviewed by admin before going live</p>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label><input type="text" value={f.name} onChange={e => u('name', e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={f.description} onChange={e => u('description', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label><input type="number" value={f.price} onChange={e => u('price', e.target.value)} required min="1" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label><input type="number" value={f.stock} onChange={e => u('stock', e.target.value)} required min="0" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={f.category} onChange={e => u('category', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm">{CATS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}</select></div>
        <div className="flex gap-3"><button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50">{loading ? 'Submitting...' : 'Submit for Approval'}</button><button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button></div>
      </form>
    </div>
  );
}
