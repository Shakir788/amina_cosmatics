'use client';
import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';

function OrangeBlossomMark({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="12" cy="6.5" rx="2" ry="3.4"
          fill="none" stroke="currentColor" strokeWidth="1"
          transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/marques', label: 'Marques' },
  { href: '/soins', label: 'Soins du Visage' },
  { href: '/parfums', label: 'Parfums' },
  { href: '/about', label: 'À propos' },
];

export default function Navbar() {
  // Yahan toggleCart ki jagah openCart lagaya taaki 100% reliably khule
  const openCart = useCartStore((state) => state.openCart);
  const cart = useCartStore((state) => state.cart);
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Close menu/search on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 px-4 md:px-12 flex justify-center">
        <nav className="w-full max-w-[1200px] px-5 py-3.5 flex items-center justify-between bg-white/80 backdrop-blur-md border border-[#E8D9C5] rounded-full shadow-[0_8px_30px_-12px_rgba(28,20,16,0.15)]">

          {/* Left */}
          <div className="flex-1 flex items-center gap-7">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="md:hidden text-[#1C1410] p-1 -ml-1 hover:text-[#B5704A] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex gap-7 text-sm font-medium text-[#1C1410]/65">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="hover:text-[#B5704A] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center — Logo */}
          <div className="flex-1 text-center">
            <Link href="/" className="inline-flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <OrangeBlossomMark className="w-3.5 h-3.5 text-[#B5704A] hidden sm:block" />
              <h1 className="text-xl md:text-2xl tracking-tight text-[#1C1410]"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
                Cosmétiques Amina
              </h1>
              <OrangeBlossomMark className="w-3.5 h-3.5 text-[#B5704A] hidden sm:block" />
            </Link>
          </div>

          {/* Right — Icons */}
          <div className="flex-1 flex justify-end items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              className="p-1.5 text-[#1C1410]/80 hover:text-[#B5704A] transition-colors"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Clickable Area Badha Diya (p-1.5) aur onClick mein openCart laga diya */}
            <button 
              onClick={openCart} 
              aria-label="Ouvrir le panier"
              className="relative p-1.5 cursor-pointer group outline-none"
            >
              <ShoppingBag className="w-[18px] h-[18px] text-[#1C1410]/80 group-hover:text-[#B5704A] transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B5704A] text-[#FBF6F0] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ===================== MOBILE MENU DRAWER ===================== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-[#1C1410]/40 backdrop-blur-sm z-[60]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-[80vw] max-w-[320px] bg-[#FBF6F0] z-[70] flex flex-col shadow-[8px_0_40px_-12px_rgba(28,20,16,0.3)] border-r border-[#E8D9C5]"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8D9C5]">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <span className="text-lg tracking-tight text-[#1C1410]"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
                    Cosmétiques Amina
                  </span>
                </Link>
                <button onClick={() => setMenuOpen(false)}
                  className="text-[#1C1410]/60 hover:text-[#1C1410] p-1 rounded-full hover:bg-[#E8D9C5]/50 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-6 py-8 space-y-1">
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between py-4 border-b border-[#E8D9C5]/70 text-[#1C1410] hover:text-[#B5704A] transition-colors"
                    >
                      <span className="text-base font-medium">{link.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#B5704A]" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer of drawer */}
              <div className="px-6 py-6 border-t border-[#E8D9C5]">
                <OrangeBlossomMark className="w-4 h-4 text-[#D4A574] mx-auto" />
                <p className="text-[10px] text-center text-[#7A4B3A]/50 uppercase tracking-[0.2em] mt-2">
                  Casablanca, Maroc
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===================== SEARCH MODAL ===================== */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-[#1C1410]/50 backdrop-blur-sm z-[60]"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-lg z-[70]"
            >
              <form onSubmit={handleSearch}
                className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(28,20,16,0.3)] border border-[#E8D9C5] overflow-hidden flex items-center">
                <Search className="w-5 h-5 text-[#B5704A] ml-5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="flex-1 py-4 px-4 text-[#1C1410] placeholder:text-[#1C1410]/35 text-base focus:outline-none bg-transparent"
                />
                {searchQuery && (
                  <button type="submit"
                    className="mr-3 bg-[#1C1410] text-[#FBF6F0] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#B5704A] transition-colors">
                    Chercher
                  </button>
                )}
                <button type="button" onClick={() => setSearchOpen(false)}
                  className="mr-4 text-[#1C1410]/40 hover:text-[#1C1410] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </form>

              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/60 mt-3">
                Appuyez sur Échap pour fermer
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}