import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const viewport: Viewport = { themeColor: '#FF6B00' };
export const metadata: Metadata = {
  title: 'Pooja Platform',
  description: 'Your Sacred Marketplace — Shop, Find Pandits, Get AI Ritual Guidance',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen antialiased">
        <Toaster position="top-right" toastOptions={{ style: { background: '#fff', color: '#1e293b', borderRadius: '12px', fontSize: '14px' } }} />
        {children}
      </body>
    </html>
  );
}
