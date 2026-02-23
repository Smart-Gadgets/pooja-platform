'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SAMPLE_PANDITS } from '@/lib/sampleData';
import { panditsApi } from '@/lib/api';
import type { Pandit } from '@/lib/types';

export default function PanditsPage() {
  const [pandits, setPandits] = useState<Pandit[]>(SAMPLE_PANDITS);
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    panditsApi.getAll(0, 20)
      .then((data: any) => {
        if (data?.content?.length) setPandits(data.content);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allSpecs = [...new Set(pandits.flatMap((p) => p.specializations))].sort();

  const filtered = pandits.filter((p) => {
    if (selectedSpec && !p.specializations.includes(selectedSpec)) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.specializations.some((s) => s.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-burgundy-800 to-burgundy-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 border border-temple-300 rounded-full" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Find Your Pandit</h1>
          <p className="text-saffron-200/70 text-lg mt-3 max-w-xl mx-auto">
            Connect with verified Vedic scholars for ceremonies, consultations, and spiritual guidance
          </p>
          {/* Search */}
          <div className="max-w-lg mx-auto mt-8">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, city, or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-temple-400/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Specialization filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedSpec('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedSpec ? 'bg-saffron-500 text-white' : 'bg-white text-burgundy-600 border border-saffron-200 hover:bg-saffron-50'
            }`}
          >
            All Specializations
          </button>
          {allSpecs.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSpec === spec ? 'bg-saffron-500 text-white' : 'bg-white text-burgundy-600 border border-saffron-200 hover:bg-saffron-50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        <p className="text-sm text-burgundy-400 mb-6">
          Showing <span className="font-medium text-burgundy-700">{filtered.length}</span> pandits
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pandit, i) => (
            <Link
              key={pandit.id}
              href={`/pandits/${pandit.id}`}
              className="card group p-6 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-saffron flex items-center justify-center text-white text-xl font-display font-bold flex-shrink-0">
                  {pandit.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-semibold text-burgundy-700 group-hover:text-saffron-600 transition-colors truncate">
                      {pandit.name}
                    </h3>
                    {pandit.verified && (
                      <svg className="w-5 h-5 text-temple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-temple-500 font-medium">{pandit.title}</p>
                  <p className="text-xs text-burgundy-400 mt-0.5">{pandit.city}, {pandit.state} · {pandit.experience} yrs exp</p>
                </div>
              </div>

              <p className="text-sm text-burgundy-400 mt-4 line-clamp-2">{pandit.bio}</p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {pandit.specializations.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-saffron-50 text-saffron-600 border border-saffron-100">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-saffron-100/50">
                <div className="flex items-center gap-1">
                  <span className="text-temple-400">★</span>
                  <span className="text-sm font-medium text-burgundy-700">{pandit.rating}</span>
                  <span className="text-xs text-gray-400">({pandit.reviewCount})</span>
                </div>
                <div className="flex items-center gap-3">
                  {pandit.virtualAvailable && (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Virtual
                    </span>
                  )}
                  <span className="text-sm font-display font-bold text-saffron-600">
                    ₹{pandit.pricePerHour}/hr
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {pandit.languages.map((l) => (
                  <span key={l} className="text-[10px] text-burgundy-400 font-medium">{l}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
