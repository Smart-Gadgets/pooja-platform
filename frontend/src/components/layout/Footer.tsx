'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  shop: [
    { href: '/products', label: 'All Products' },
    { href: '/products?category=puja-kits', label: 'Puja Kits' },
    { href: '/products?category=idols-murtis', label: 'Idols & Murtis' },
    { href: '/products?category=incense-dhoop', label: 'Incense & Dhoop' },
  ],
  services: [
    { href: '/pandits', label: 'Find a Pandit' },
    { href: '/ai-assistant', label: 'AI Pooja Guide' },
    { href: '/pandits?filter=virtual', label: 'Virtual Ceremonies' },
    { href: '/about', label: 'Ritual Guides' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/about#contact', label: 'Contact' },
    { href: '/about#careers', label: 'Careers' },
    { href: '/about#blog', label: 'Blog' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gradient-dark text-cream-100 ornament-overlay">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-3xl">🙏</span>
              <span className="font-display text-2xl font-bold text-white">
                Pooja<span className="font-light text-temple-300">Platform</span>
              </span>
            </Link>
            <p className="text-saffron-200/70 text-sm leading-relaxed max-w-sm mt-3">
              Your one-stop destination for all pooja essentials, connecting devotees with 
              verified pandits and authentic spiritual products across India.
            </p>
            <div className="flex gap-3 mt-6">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="w-10 h-10 rounded-full border border-temple-600/30 flex items-center justify-center text-temple-300 hover:bg-temple-600/20 hover:border-temple-400 transition-all duration-200"
                >
                  <span className="text-sm capitalize">{social.charAt(0).toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display text-lg font-semibold text-temple-300 mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-saffron-200/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-semibold text-temple-300 mb-4">Services</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-saffron-200/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display text-lg font-semibold text-temple-300 mb-4">Company</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-saffron-200/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-temple-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-saffron-200/40">
            &copy; {new Date().getFullYear()} Pooja Platform. All rights reserved. Made with 🙏 in India.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-saffron-200/40 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-saffron-200/40 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund" className="text-xs text-saffron-200/40 hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
