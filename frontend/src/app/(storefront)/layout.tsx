import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cream-100 font-body">
      <Navbar />
      <main className="pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
