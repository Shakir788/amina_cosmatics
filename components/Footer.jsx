'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

function OrangeBlossomMark({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="12" cy="6.5" rx="2" ry="3.4" fill="none" stroke="currentColor" strokeWidth="1" transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
}

// UPGRADED: Contrast fix and premium hover effect on badges
function TrustBadge({ title, subtitle }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#B5704A]/50 group-hover:bg-[#B5704A]/10 transition-all duration-300 shrink-0">
        <OrangeBlossomMark className="w-5 h-5 text-[#B5704A]" />
      </div>
      <div>
        <p className="text-[#FBF6F0] text-sm font-medium tracking-wide">{title}</p>
        <p className="text-[#FBF6F0]/50 text-xs mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#1C1410] text-[#FBF6F0] mt-24 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#B5704A]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#D4A574]/10 blur-[120px]" />

      {/* Trust Bar */}
      <div className="relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 grid sm:grid-cols-3 gap-8">
          <TrustBadge title="Livraison 24/48h" subtitle="Partout au Maroc" />
          <TrustBadge title="100% Authentique" subtitle="Marques certifiées" />
          <TrustBadge title="Retour facile" subtitle="Sous 7 jours" />
        </div>
      </div>

      {/* Ultra-thin gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E8D9C5]/15 to-transparent" />

      {/* Main Footer Content */}
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-16 grid md:grid-cols-12 gap-12">
        
        {/* Brand & Newsletter */}
        <div className="md:col-span-5">
          <h2 className="text-3xl tracking-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
            Cosmétiques Amina
          </h2>
          <p className="text-[#FBF6F0]/60 text-sm leading-relaxed max-w-sm mb-8">
            Votre sélection des meilleures marques de cosmétiques mondiales, choisies spécialement pour votre éclat.
          </p>

          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4A574] font-semibold mb-4">Restez informée</p>
          {subscribed ? (
            <p className="text-sm text-[#FBF6F0]/80 flex items-center gap-2 bg-white/5 py-3 px-5 rounded-full border border-white/10 w-fit">
              <OrangeBlossomMark className="w-4 h-4 text-[#D4A574]" /> Merci, vous êtes inscrite !
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex max-w-sm group">
              <input 
                type="email" 
                required 
                placeholder="Votre e-mail" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="flex-1 bg-white/5 border border-white/15 border-r-0 rounded-l-full px-5 py-3.5 text-sm placeholder:text-[#FBF6F0]/35 focus:outline-none focus:border-[#B5704A] focus:bg-white/10 transition-all duration-300" 
              />
              <button 
                type="submit" 
                aria-label="S'abonner" 
                className="bg-[#B5704A] hover:bg-[#D4A574] text-white px-6 rounded-r-full flex items-center justify-center transition-colors active:scale-95 shadow-md"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Links - Collections */}
        <div className="md:col-span-2 md:pl-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4A574] font-semibold mb-6">Collections</p>
          <ul className="space-y-4 text-sm text-[#FBF6F0]/65">
            <li><Link href="/marques" className="inline-block hover:text-[#B5704A] hover:translate-x-1 transition-all duration-300">Marques</Link></li>
            <li><Link href="/soins" className="inline-block hover:text-[#B5704A] hover:translate-x-1 transition-all duration-300">Soins du Visage</Link></li>
            <li><Link href="/parfums" className="inline-block hover:text-[#B5704A] hover:translate-x-1 transition-all duration-300">Parfums</Link></li>
          </ul>
        </div>

        {/* Links - Maison */}
        <div className="md:col-span-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4A574] font-semibold mb-6">Maison</p>
          <ul className="space-y-4 text-sm text-[#FBF6F0]/65">
            <li><Link href="/about" className="inline-block hover:text-[#B5704A] hover:translate-x-1 transition-all duration-300">À propos</Link></li>
            <li><Link href="/contact" className="inline-block hover:text-[#B5704A] hover:translate-x-1 transition-all duration-300">Contact</Link></li>
            <li><Link href="/faq" className="inline-block hover:text-[#B5704A] hover:translate-x-1 transition-all duration-300">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div className="md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4A574] font-semibold mb-6">Contact</p>
          <ul className="space-y-4 text-sm text-[#FBF6F0]/65 mb-7">
            <li className="flex items-center gap-2">Casablanca, Maroc</li>
          </ul>
          
          <div className="flex items-center gap-3">
            <a href="https://wa.me/212723908603" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#B5704A] hover:text-[#B5704A] hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <FaWhatsapp className="w-[18px] h-[18px]" />
            </a>
            <a href="mailto:aminaclothingbrand@gmail.com" aria-label="Email" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#B5704A] hover:text-[#B5704A] hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <FaEnvelope className="w-[18px] h-[18px]" />
            </a>
            <a href="https://www.instagram.com/aminaclothingbrand/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#B5704A] hover:text-[#B5704A] hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <FaInstagram className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E8D9C5]/15 to-transparent" />

      {/* Bottom Bar */}
      <div className="relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#FBF6F0]/40 text-xs">© {new Date().getFullYear()} Cosmétiques Amina. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#FBF6F0]/35 mr-1 font-medium">Paiement Sécurisé</span>
            <span className="text-[10px] font-semibold bg-white/10 px-3 py-1.5 rounded-md text-[#FBF6F0]/70 border border-white/5">Visa</span>
            <span className="text-[10px] font-semibold bg-white/10 px-3 py-1.5 rounded-md text-[#FBF6F0]/70 border border-white/5">Mastercard</span>
            <span className="text-[10px] font-semibold bg-white/10 px-3 py-1.5 rounded-md text-[#FBF6F0]/70 border border-white/5">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}