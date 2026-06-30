'use client';
import { ShoppingBag, Search, Menu } from 'lucide-react';
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

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6 md:px-12 flex justify-center">
      <nav className="w-full max-w-[1200px] px-6 py-4 flex items-center justify-between bg-white/75 backdrop-blur-md border border-[#E8D9C5] rounded-full shadow-[0_8px_30px_-12px_rgba(28,20,16,0.15)]">

        {/* Left - Hamburger (Mobile) / Links (Desktop) */}
        <div className="flex-1 flex items-center gap-7">
          <Menu className="w-6 h-6 md:hidden text-[#1C1410] cursor-pointer" />
          <div className="hidden md:flex gap-7 text-sm font-medium text-[#1C1410]/65">
            <Link href="/marques" className="hover:text-[#B5704A] transition-colors">Marques</Link>
            <Link href="/soins" className="hover:text-[#B5704A] transition-colors">Soins du Visage</Link>
            <Link href="/parfums" className="hover:text-[#B5704A] transition-colors">Parfums</Link>
            {/* Yahan add kiya About Us */}
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
  );
}