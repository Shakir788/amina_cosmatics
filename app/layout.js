import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import AIAssistant from '../components/AIAssistant'; // Floating AI Closer

// Font optimization for ultra-fast loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-cormorant',
});

export const metadata = {
  title: 'Cosmétiques Amina | Beauté Premium',
  description: 'Curated premium multi-brand cosmetic marketplace in Morocco.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable} antialiased`}>
      <body className="font-sans min-h-screen relative overflow-x-hidden bg-[#FBF6F0] text-[#1C1410] flex flex-col">

        {/* Luxury Background Glow - Performance friendly pointer-events-none */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#D4A574]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#B5704A]/10 rounded-full blur-[120px]"></div>
        </div>

        <Navbar />

        <main className="flex-1 pt-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full relative z-10">
          {children}
        </main>

        <Footer />

        {/* Global Components */}
        <CartDrawer />
        <AIAssistant /> {/* Floating AI Assistant */}

      </body>
    </html>
  );
}