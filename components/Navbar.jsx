'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import { useCartStore } from '../store/useCartStore';

function OrangeBlossomMark({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6.5"
          rx="2"
          ry="3.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

export default function Navbar() {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cart = useCartStore((state) => state.cart);
  
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu automatically when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock background scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* --- Main Floating Navbar --- */}
      <div className="fixed top-6 left-0 right-0 z-40 px-6 md:px-12 flex justify-center">
        <nav className="w-full max-w-[1200px] px-6 py-4 flex items-center justify-between bg-white/75 backdrop-blur-md border border-[#E8D9C5] rounded-full shadow-[0_8px_30px_-12px_rgba(28,20,16,0.15)]">

          {/* Left - Hamburger (Mobile) / Links (Desktop) */}
          <div className="flex-1 flex items-center gap-7">
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden outline-none"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6 text-[#1C1410] cursor-pointer hover:text-[#B5704A] transition-colors" />
            </button>
            
            <div className="hidden md:flex gap-7 text-sm font-medium text-[#1C1410]/65">
              <Link href="/marques" className="hover:text-[#B5704A] transition-colors">Marques</Link>
              <Link href="/soins" className="hover:text-[#B5704A] transition-colors">Soins du Visage</Link>
              <Link href="/parfums" className="hover:text-[#B5704A] transition-colors">Parfums</Link>
              <Link href="/about" className="hover:text-[#B5704A] transition-colors">À propos</Link>
            </div>
          </div>

          {/* Center - Brand Logo */}
          <div className="flex-1 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <OrangeBlossomMark className="w-3.5 h-3.5 text-[#B5704A] hidden sm:block" />
              <h1
                className="text-xl md:text-2xl tracking-tight text-[#1C1410]"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
              >
                Cosmétiques Amina
              </h1>
              <OrangeBlossomMark className="w-3.5 h-3.5 text-[#B5704A] hidden sm:block" />
            </Link>
          </div>

          {/* Right - Icons */}
          <div className="flex-1 flex justify-end items-center gap-5">
            <Search className="w-[18px] h-[18px] text-[#1C1410]/80 cursor-pointer hover:text-[#B5704A] transition-colors" />

            <button onClick={toggleCart} className="relative cursor-pointer group outline-none">
              <ShoppingBag className="w-[18px] h-[18px] text-[#1C1410]/80 group-hover:text-[#B5704A] transition-colors" />

              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#B5704A] text-[#FBF6F0] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* --- Mobile Drawer Menu --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-[#1C1410] text-[#FBF6F0] transform transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden flex flex-col`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 pt-10 pb-6 border-b border-white/10">
          <span className="text-2xl tracking-tight" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
            Menu
          </span>
          <button 
            className="p-2 -mr-2 text-[#FBF6F0]/70 hover:text-white transition-colors outline-none"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto py-10 px-8 flex flex-col gap-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A574] font-bold mb-2">Collections</p>
          <Link href="/marques" className="text-3xl font-light tracking-tight hover:text-[#B5704A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Marques</Link>
          <Link href="/soins" className="text-3xl font-light tracking-tight hover:text-[#B5704A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Soins du Visage</Link>
          <Link href="/parfums" className="text-3xl font-light tracking-tight hover:text-[#B5704A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Parfums</Link>
          
          <div className="w-full h-px bg-white/10 my-4" />

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A574] font-bold mb-2">Maison</p>
          <Link href="/about" className="text-lg font-medium text-white/80 hover:text-white transition-colors">À propos</Link>
          <Link href="/contact" className="text-lg font-medium text-white/80 hover:text-white transition-colors">Contactez-Nous</Link>
          <Link href="/faq" className="text-lg font-medium text-white/80 hover:text-white transition-colors">FAQ</Link>
        </div>

        {/* Drawer Footer (Socials) */}
        <div className="px-8 pb-12 pt-6 border-t border-white/10 flex items-center gap-6">
          <a href="https://wa.me/212723908603" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#B5704A] hover:border-[#B5704A] transition-all">
            <FaWhatsapp className="w-5 h-5" />
          </a>
          <a href="https://www.instagram.com/aminaclothingbrand/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#B5704A] hover:border-[#B5704A] transition-all">
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </>
  );
}