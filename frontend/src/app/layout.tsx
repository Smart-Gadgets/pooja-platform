import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const viewport: Viewport = { themeColor: '#FF6B00' };

export const metadata: Metadata = {
  title: 'Pooja Platform — Your Sacred Marketplace',
  description: 'Discover authentic pooja items, connect with verified pandits, and explore Hindu rituals with AI-powered guidance.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-cream-100 font-body antialiased">
        <Toaster position="top-right" toastOptions={{
          style: { background: '#fff', color: '#5C1A1A', border: '1px solid rgba(212,160,18,0.2)', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif' },
        }} />
        {children}
      </body>
    </html>
  );
}
