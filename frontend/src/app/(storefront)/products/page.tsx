'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/sampleData';
import { productsApi } from '@/lib/api';
import type { Product } from '@/lib/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsApi.getAll(0, 24)
      .then((data: any) => {
        if (data?.content?.length) setProducts(data.content);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const getCategoryEmoji = (cat: string) => {
    const c = CATEGORIES.find((c) => c.id === cat);
    return c?.icon || '🙏';
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-saffron-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="section-title">Sacred Shop</h1>
          <p className="section-subtitle">Authentic pooja items for every ritual and ceremony</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card-flat p-5 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium text-burgundy-600 mb-2 block">Search</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field !pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="text-sm font-medium text-burgundy-600 mb-2 block">Category</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory ? 'bg-saffron-50 text-saffron-600 font-medium' : 'text-burgundy-500 hover:bg-saffron-50/50'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id ? 'bg-saffron-50 text-saffron-600 font-medium' : 'text-burgundy-500 hover:bg-saffron-50/50'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium text-burgundy-600 mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-burgundy-400">
                Showing <span className="font-medium text-burgundy-700">{filtered.length}</span> products
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card-flat overflow-hidden">
                    <div className="aspect-[4/3] shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 w-3/4 shimmer rounded" />
                      <div className="h-3 w-full shimmer rounded" />
                      <div className="h-6 w-1/3 shimmer rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="font-display text-2xl font-semibold text-burgundy-700">No products found</h3>
                <p className="text-burgundy-400 mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="card group">
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-saffron-50 to-cream-100 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                        {getCategoryEmoji(product.category)}
                      </div>
                      {product.originalPrice && (
                        <span className="absolute top-3 left-3 badge-vermillion">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-temple-400 text-sm">{'★'.repeat(Math.floor(product.rating || 0))}</span>
                        <span className="text-xs text-gray-400">({product.reviewCount})</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-burgundy-700 group-hover:text-saffron-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-burgundy-400 mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xl font-bold text-saffron-600">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-xs text-green-600 font-medium">In Stock</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-saffron-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 w-48 shimmer rounded mb-2" />
          <div className="h-4 w-80 shimmer rounded" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-flat overflow-hidden">
              <div className="aspect-[4/3] shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 shimmer rounded" />
                <div className="h-3 w-full shimmer rounded" />
                <div className="h-6 w-1/3 shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
