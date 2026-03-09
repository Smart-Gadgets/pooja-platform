'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, aiImageApi } from '@/lib/api';
import toast from 'react-hot-toast';

const CATS = ['POOJA_SAMAGRI','IDOLS_MURTIS','BOOKS_SCRIPTURES','INCENSE_DHOOP','FLOWERS_GARLANDS','PRASAD_SWEETS','POOJA_THALI','DIYA_LAMPS','SACRED_THREAD','HAVAN_MATERIAL','GEMSTONES_RUDRAKSHA','FESTIVAL_SPECIAL','DAILY_ESSENTIALS','OTHER'];

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [f, setF] = useState({ name: '', description: '', price: '', stock: '', category: 'POOJA_SAMAGRI', usageInstructions: '' });
  const u = (k: string, v: string) => setF({ ...f, [k]: v });

  // AI: Generate product images
  const generateImages = () => {
    if (!f.name) { toast.error('Enter product name first'); return; }
    setAiLoading('images');
    const urls = aiImageApi.generateProductImages(f.name, f.description || f.category, 4);
    setGeneratedImages(urls);
    setSelectedImages(urls);
    setAiLoading(null);
    toast.success('AI images generated! They load from Pollinations.ai');
  };

  // AI: Generate description
  const generateDescription = async () => {
    if (!f.name) { toast.error('Enter product name first'); return; }
    setAiLoading('desc');
    const desc = await aiImageApi.generateDescription(f.name, f.category);
    if (desc) { u('description', desc); toast.success('AI description generated'); }
    else toast.error('AI unavailable — write manually');
    setAiLoading(null);
  };

  // AI: Suggest price
  const suggestPrice = async () => {
    if (!f.name) { toast.error('Enter product name first'); return; }
    setAiLoading('price');
    const price = await aiImageApi.suggestPrice(f.name, f.category);
    if (price && !isNaN(Number(price))) { u('price', price.replace(/[^0-9.]/g, '')); toast.success('AI price suggestion applied'); }
    else toast.error('AI unavailable — set price manually');
    setAiLoading(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await productsApi.create({
        name: f.name, description: f.description, price: parseFloat(f.price), stock: parseInt(f.stock),
        category: f.category, usageInstructions: f.usageInstructions,
        imageUrls: selectedImages, thumbnailUrl: selectedImages[0] || null,
      });
      toast.success('Product submitted for approval!');
      router.push('/seller/products');
    } catch (err: any) { toast.error(err.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const toggleImage = (url: string) => {
    setSelectedImages(prev => prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Product</h1>
      <p className="text-gray-500 text-sm mb-8">Products are reviewed by admin before going live</p>

      <form onSubmit={submit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider text-gray-500 mb-2">Basic Information</h2>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input type="text" value={f.name} onChange={e => u('name', e.target.value)} required placeholder="e.g. Complete Ganesh Puja Kit"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <button type="button" onClick={generateDescription} disabled={!!aiLoading}
                className="px-3 py-1 rounded-lg bg-violet-100 text-violet-700 text-xs font-medium hover:bg-violet-200 disabled:opacity-50 flex items-center gap-1">
                {aiLoading === 'desc' ? '⏳ Generating...' : '🤖 AI Generate'}
              </button>
            </div>
            <textarea value={f.description} onChange={e => u('description', e.target.value)} rows={4} placeholder="Describe your product..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
                <button type="button" onClick={suggestPrice} disabled={!!aiLoading}
                  className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 text-[10px] font-medium hover:bg-violet-200 disabled:opacity-50">
                  {aiLoading === 'price' ? '⏳' : '🤖 Suggest'}
                </button>
              </div>
              <input type="number" value={f.price} onChange={e => u('price', e.target.value)} required min="1" step="0.01"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input type="number" value={f.stock} onChange={e => u('stock', e.target.value)} required min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={f.category} onChange={e => u('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm">
              {CATS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
            </select></div>
        </div>

        {/* AI Image Generation */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wider text-gray-500">Product Images</h2>
              <p className="text-xs text-gray-400 mt-0.5">AI-generated using Pollinations.ai (free, no API key needed)</p>
            </div>
            <button type="button" onClick={generateImages} disabled={!!aiLoading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/20 transition-all disabled:opacity-50 flex items-center gap-2">
              {aiLoading === 'images' ? '⏳ Generating...' : '🎨 Generate AI Images'}
            </button>
          </div>

          {generatedImages.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {generatedImages.map((url, i) => (
                <div key={i} className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImages.includes(url) ? 'border-emerald-500 shadow-lg' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => toggleImage(url)}>
                  <img src={url} alt={`AI generated ${i + 1}`} className="w-full aspect-square object-cover bg-gray-100"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/512x512/f3f4f6/9ca3af?text=Image+${i + 1}`; }} />
                  {selectedImages.includes(url) && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">✓</div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                    <p className="text-white text-[10px]">{['Front', 'Lifestyle', 'Detail', 'Package'][i]}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400">
              <span className="text-3xl block mb-2">🎨</span>
              <p className="text-sm">Enter a product name, then click &quot;Generate AI Images&quot;</p>
              <p className="text-xs mt-1">Images are generated by Pollinations.ai — completely free</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm">
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
