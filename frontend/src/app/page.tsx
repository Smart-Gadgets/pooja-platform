'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SAMPLE_PRODUCTS, SAMPLE_PANDITS, CATEGORIES, TESTIMONIALS, RITUAL_GUIDES } from '@/lib/sampleData';
import { productsApi, panditsApi } from '@/lib/api';

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden ornament-overlay">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-saffron-50 to-cream-200" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-temple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-saffron-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-temple-300/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-temple-300/5 rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-temple-200 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-temple-600">Trusted by 50,000+ families</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-burgundy-800 leading-[1.1] tracking-tight">
              Your Sacred
              <br />
              <span className="text-gradient-saffron">Marketplace</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-burgundy-400 max-w-lg leading-relaxed">
              Discover authentic pooja essentials, connect with verified pandits, 
              and explore the depth of Hindu rituals — all guided by AI.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/products" className="btn-primary text-base !px-8 !py-4">
                Shop Now
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
              <Link href="/pandits" className="btn-secondary text-base !px-8 !py-4">
                Find a Pandit
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-temple-200/30">
              {[
                { value: '5,000+', label: 'Products' },
                { value: '500+', label: 'Verified Pandits' },
                { value: '50,000+', label: 'Happy Families' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-display text-2xl font-bold text-burgundy-700">{stat.value}</div>
                  <div className="text-xs text-burgundy-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:block relative animate-slide-up">
            <div className="relative w-full aspect-square">
              {/* Main diya/lamp image area */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-saffron-200 via-temple-200 to-vermillion-100 animate-float" />
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-saffron-100 to-cream-50 flex items-center justify-center">
                <span className="text-[120px]">🪔</span>
              </div>
              {/* Floating elements */}
              <div className="absolute top-4 right-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>🙏</div>
              <div className="absolute bottom-16 left-4 text-4xl animate-float" style={{ animationDelay: '2s' }}>🌺</div>
              <div className="absolute top-1/3 left-0 text-3xl animate-float" style={{ animationDelay: '3s' }}>📿</div>
              <div className="absolute bottom-4 right-16 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>🔔</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Find everything you need for your spiritual practice</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((category, i) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative bg-gradient-to-br from-cream-50 to-saffron-50 rounded-2xl p-6 text-center border border-saffron-100/50 hover:border-temple-300 hover:shadow-warm-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-4xl md:text-5xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </span>
              <h3 className="font-display text-lg font-semibold text-burgundy-700">{category.name}</h3>
              <p className="text-xs text-temple-500 mt-1 font-medium">{category.nameHi}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSection() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);

  useEffect(() => {
    productsApi.getFeatured()
      .then((data: any) => {
        if (data?.content?.length) setProducts(data.content);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 ornament-overlay bg-cream-50">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked spiritual essentials for you</p>
          </div>
          <Link href="/products" className="btn-ghost hidden md:inline-flex">
            View All
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product, i) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="card group animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-saffron-50 to-cream-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                  {product.category === 'puja-kits' ? '🪔' :
                   product.category === 'diyas-lamps' ? '🕯️' :
                   product.category === 'incense-dhoop' ? '🌿' :
                   product.category === 'rudraksha' ? '📿' :
                   product.category === 'havan-samagri' ? '🔥' : '🙏'}
                </div>
                {product.originalPrice && (
                  <span className="absolute top-3 left-3 badge-vermillion">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                {product.featured && (
                  <span className="absolute top-3 right-3 badge-temple">Featured</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-temple-400 text-sm">{'★'.repeat(Math.floor(product.rating || 0))}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-burgundy-700 group-hover:text-saffron-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-burgundy-400 mt-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="font-display text-2xl font-bold text-saffron-600">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/products" className="btn-secondary">View All Products</Link>
        </div>
      </div>
    </section>
  );
}

function PanditsSection() {
  const [pandits, setPandits] = useState(SAMPLE_PANDITS);

  useEffect(() => {
    panditsApi.getAll(0, 4)
      .then((data: any) => {
        if (data?.content?.length) setPandits(data.content);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Meet Our Pandits</h2>
          <p className="section-subtitle">Verified scholars for your sacred ceremonies</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pandits.slice(0, 4).map((pandit, i) => (
            <Link
              key={pandit.id}
              href={`/pandits/${pandit.id}`}
              className="card group text-center p-6 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-saffron flex items-center justify-center text-white text-3xl font-display font-bold mb-4">
                {pandit.name.charAt(0)}
              </div>
              {pandit.verified && (
                <span className="badge-temple mx-auto mb-2">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
              <h3 className="font-display text-xl font-semibold text-burgundy-700 mt-2">{pandit.name}</h3>
              <p className="text-sm text-temple-500 font-medium mt-1">{pandit.title}</p>
              <p className="text-xs text-burgundy-400 mt-2">{pandit.city}, {pandit.state}</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <span className="text-temple-400 text-sm">★</span>
                <span className="text-sm font-medium text-burgundy-600">{pandit.rating}</span>
                <span className="text-xs text-gray-400">({pandit.reviewCount} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-1 justify-center mt-3">
                {pandit.specializations.slice(0, 2).map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-saffron-50 text-saffron-600 border border-saffron-100">
                    {s}
                  </span>
                ))}
              </div>
              {pandit.virtualAvailable && (
                <p className="text-xs text-green-600 mt-3 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Virtual Available
                </p>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/pandits" className="btn-secondary">
            Browse All Pandits
          </Link>
        </div>
      </div>
    </section>
  );
}

function AiGuideSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-burgundy-800 via-burgundy-700 to-burgundy-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 border border-temple-300 rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-temple-300 rounded-full" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge bg-temple-400/20 text-temple-300 border border-temple-400/30 mb-4">
              AI-Powered
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Your Personal
              <br />
              <span className="text-temple-300">Spiritual Guide</span>
            </h2>
            <p className="mt-6 text-saffron-200/70 text-lg leading-relaxed max-w-lg">
              Ask our AI assistant about any Hindu ritual, ceremony, or spiritual practice. 
              Get detailed guidance on mantras, procedures, and auspicious timings — 
              available in Hindi, English, and Tamil.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/ai-assistant" className="btn-primary !bg-temple-400 hover:!bg-temple-500 text-base">
                Try AI Guide
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {RITUAL_GUIDES.map((guide, i) => (
              <div
                key={guide.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:bg-white/15 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-3xl mb-3 block">{guide.icon}</span>
                <h3 className="font-display text-lg font-semibold text-white">{guide.title}</h3>
                <p className="text-xs text-saffron-200/50 mt-2 leading-relaxed">{guide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">What Families Say</h2>
          <p className="section-subtitle">Trusted by devotees across India</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className="card-flat p-8 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-temple-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-burgundy-600 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-6 pt-4 border-t border-saffron-100">
                <p className="font-display text-lg font-semibold text-burgundy-700">{t.name}</p>
                <p className="text-xs text-burgundy-400">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-saffron text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
          Begin Your Spiritual Journey Today
        </h2>
        <p className="mt-4 text-white/80 text-lg max-w-lg mx-auto">
          Join thousands of families who trust Pooja Platform for their sacred ceremonies and spiritual needs.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link href="/auth/register" className="inline-flex items-center px-8 py-4 bg-white text-saffron-600 font-semibold rounded-lg hover:bg-cream-50 transition-colors">
            Create Free Account
          </Link>
          <Link href="/products" className="inline-flex items-center px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
            Explore Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <PanditsSection />
      <AiGuideSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
