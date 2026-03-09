'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-burgundy-800 to-burgundy-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 border border-temple-300 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 border border-temple-300 rounded-full" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Bridging Tradition
            <br />
            <span className="text-temple-300">with Technology</span>
          </h1>
          <p className="mt-6 text-saffron-200/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Pooja Platform is India&apos;s first AI-powered spiritual marketplace, connecting 
            devotees with authentic products and verified pandits to make sacred practices 
            accessible to everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🪔',
                title: 'Our Mission',
                desc: 'To make authentic Hindu spiritual practices accessible to every family, whether they are in a metro city or living abroad, through technology and trusted guidance.',
              },
              {
                icon: '🙏',
                title: 'Our Vision',
                desc: 'A world where no one has to compromise on the authenticity of their spiritual practices due to distance, lack of knowledge, or unavailability of resources.',
              },
              {
                icon: '✨',
                title: 'Our Values',
                desc: 'Authenticity in every product, respect for every tradition, transparency in every transaction, and inclusivity for all devotees across sects and regions.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <span className="text-5xl block mb-4">{item.icon}</span>
                <h3 className="font-display text-2xl font-semibold text-burgundy-700 mb-3">{item.title}</h3>
                <p className="text-burgundy-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 ornament-overlay bg-cream-50">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Makes Us Different</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🤖', title: 'AI-Powered Guidance', desc: 'Our RAG-based AI assistant provides accurate, multi-language guidance on rituals, mantras, and auspicious timings.' },
              { icon: '✅', title: 'Verified Pandits', desc: 'Every pandit on our platform is verified for knowledge, experience, and authenticity through a rigorous process.' },
              { icon: '🌿', title: 'Authentic Products', desc: 'All products are sourced from trusted sellers and verified for quality and authenticity before listing.' },
              { icon: '💻', title: 'Virtual Ceremonies', desc: 'Can\'t travel? Our pandits conduct full ceremonies virtually with the same devotion and adherence to traditions.' },
              { icon: '📚', title: 'Knowledge Library', desc: 'Extensive guides, blogs, and videos on Hindu rituals created by scholars and experienced pandits.' },
              { icon: '🔒', title: 'Secure Payments', desc: 'All transactions are secured through Razorpay with encryption and buyer protection.' },
            ].map((f) => (
              <div key={f.title} className="card-flat p-6 flex gap-4">
                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-burgundy-700">{f.title}</h3>
                  <p className="text-sm text-burgundy-400 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Get in Touch</h2>
          <p className="section-subtitle mb-8">Have questions? We would love to hear from you.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: '📧', label: 'Email', value: 'support@poojaplatform.com' },
              { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
              { icon: '📍', label: 'Location', value: 'Bangalore, India' },
            ].map((c) => (
              <div key={c.label} className="card-flat p-5 text-center">
                <span className="text-3xl block mb-2">{c.icon}</span>
                <p className="text-sm font-medium text-burgundy-700">{c.label}</p>
                <p className="text-xs text-burgundy-400 mt-1">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-saffron text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to Begin?</h2>
          <p className="text-white/80 mt-3">Join our community of devotees and experience spiritual practices like never before.</p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link href="/auth/register" className="inline-flex items-center px-8 py-3 bg-white text-saffron-600 font-semibold rounded-lg hover:bg-cream-50 transition-colors">
              Create Account
            </Link>
            <Link href="/products" className="inline-flex items-center px-8 py-3 border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
