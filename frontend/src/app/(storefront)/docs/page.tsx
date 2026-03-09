'use client';

import Link from 'next/link';

const DOCS = [
  { title: 'Platform Documentation', desc: 'Complete technical overview — architecture, microservices, API reference, AI features, deployment, and security.', file: '/docs/Pooja_Platform_Documentation.pdf', icon: '📚', color: 'from-burgundy-700 to-burgundy-800' },
  { title: 'Admin Console Guide', desc: 'User management, product approval, pandit verification, order lifecycle, and platform settings.', file: '/docs/Admin_Guide.pdf', icon: '👑', color: 'from-violet-600 to-indigo-700' },
  { title: 'Seller Central Guide', desc: 'Product listing, AI image generation, AI descriptions, order management, and analytics.', file: '/docs/Seller_Guide.pdf', icon: '🏪', color: 'from-emerald-600 to-teal-700' },
  { title: 'Pandit Portal Guide', desc: 'Profile setup, booking management, content creation, scheduling, and earnings tracking.', file: '/docs/Pandit_Guide.pdf', icon: '🙏', color: 'from-amber-600 to-orange-700' },
  { title: 'Customer Guide', desc: 'Shopping, AI spiritual guide, pandit booking, checkout, and order tracking.', file: '/docs/Customer_Guide.pdf', icon: '🛍️', color: 'from-blue-600 to-indigo-700' },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-burgundy-800">Documentation</h1>
          <p className="text-burgundy-500 mt-3 max-w-lg mx-auto">Comprehensive guides for every role on Pooja Platform. Download the PDF that matches your needs.</p>
        </div>

        <div className="grid gap-4">
          {DOCS.map(doc => (
            <a key={doc.file} href={doc.file} target="_blank" rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-saffron-100 p-6 flex items-center gap-6 hover:shadow-xl hover:shadow-saffron-500/5 transition-all">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doc.color} flex items-center justify-center text-2xl text-white shadow-lg flex-shrink-0`}>
                {doc.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold text-burgundy-800 group-hover:text-saffron-600 transition-colors">{doc.title}</h3>
                <p className="text-sm text-burgundy-400 mt-1">{doc.desc}</p>
              </div>
              <div className="flex-shrink-0 text-saffron-500 group-hover:text-saffron-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-burgundy-400">
            Need help? Try our <Link href="/ai-assistant" className="text-saffron-600 hover:underline">AI Spiritual Guide</Link> or
            contact support at <span className="font-medium">support@pooja.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
