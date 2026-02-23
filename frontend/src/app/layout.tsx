import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Pooja Platform — Your Sacred Marketplace',
  description: 'Discover authentic pooja items, connect with verified pandits, and explore Hindu rituals with AI-powered guidance. Your one-stop spiritual marketplace.',
  keywords: ['pooja', 'hindu', 'puja', 'pandit', 'spiritual', 'marketplace', 'rituals'],
  manifest: '/manifest.json',
  themeColor: '#FF6B00',
  openGraph: {
    title: 'Pooja Platform — Your Sacred Marketplace',
    description: 'Authentic pooja items & verified pandits for all your spiritual needs.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-cream-100 font-body antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#5C1A1A',
              border: '1px solid rgba(212, 160, 18, 0.2)',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />
        <Navbar />
        <main className="pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
