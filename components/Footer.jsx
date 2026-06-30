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

function TrustBadge({ title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <OrangeBlossomMark className="w-5 h-5 text-[#D4A574] shrink-0" />
      <div>
        <p className="text-[#1C1410] text-sm font-medium">{title}</p>
        <p className="text-[#7A4B3A]/60 text-xs">{subtitle}</p>
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
      <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#B5704A]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#D4A574]/10 blur-3xl" />

      <div className="relative border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 grid sm:grid-cols-3 gap-8">
          <TrustBadge title="Livraison 24/48h" subtitle="Partout au Maroc" />
          <TrustBadge title="100% Authentique" subtitle="Marques certifiées" />
          <TrustBadge title="Retour facile" subtitle="Sous 7 jours" />
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-16 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <h2 className="text-3xl tracking-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
            Cosmétiques Amina
          </h2>
          <p className="text-[#FBF6F0]/60 text-sm leading-relaxed max-w-sm mb-7">
            Votre sélection des meilleures marques de cosmétiques mondiales, choisies spécialement pour votre éclat.
          </p>

          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4A574] font-semibold mb-3">Restez informée</p>
          {subscribed ? (
            <p className="text-sm text-[#FBF6F0]/80 flex items-center gap-2">
              <OrangeBlossomMark className="w-4 h-4 text-[#D4A574]" /> Merci, vous êtes inscrite !
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex max-w-sm">
              <input type="email" required placeholder="Votre e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-white/5 border border-white/15 rounded-l-full px-5 py-3 text-sm placeholder:text-[#FBF6F0]/35 focus:outline-none focus:border-[#D4A574] transition-colors" />
              <button type="submit" aria-label="S'abonner" className="bg-[#B5704A] hover:bg-[#D4A574] transition-colors px-5 rounded-r-full flex items-center justify-center">
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        <div className="md:col-span-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4A574] font-semibold mb-5">Collections</p>
          <ul className="space-y-3 text-sm text-[#FBF6F0]/65">
            <li><Link href="/marques" className="hover:text-[#FBF6F0] transition-colors">Marques</Link></li>
            <li><Link href="/soins" className="hover:text-[#FBF6F0] transition-colors">Soins du Visage</Link></li>
            <li><Link href="/parfums" className="hover:text-[#FBF6F0] transition-colors">Parfums</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4A574] font-semibold mb-5">Maison</p>
          <ul className="space-y-3 text-sm text-[#FBF6F0]/65">
            <li><Link href="/about" className="hover:text-[#FBF6F0] transition-colors">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-[#FBF6F0] transition-colors">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-[#FBF6F0] transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4A574] font-semibold mb-5">Contact</p>
          <ul className="space-y-3 text-sm text-[#FBF6F0]/65">
            <li>Casablanca, Maroc</li>
          </ul>
          <div className="flex items-center gap-4 mt-6">
            {/* CORRECTED NUMBER HERE */}
            <a href="https://wa.me/212723908603" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-[#D4A574] hover:text-[#D4A574] transition-colors">
              <FaWhatsapp className="w-4 h-4" />
            </a>
            <a href="mailto:aminaclothingbrand@gmail.com" aria-label="Email" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-[#D4A574] hover:text-[#D4A574] transition-colors">
              <FaEnvelope className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/aminaclothingbrand/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-[#D4A574] hover:text-[#D4A574] transition-colors">
              <FaInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#FBF6F0]/40 text-xs">© {new Date().getFullYear()} Cosmétiques Amina. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wide text-[#FBF6F0]/35 mr-1">Paiement</span>
            <span className="text-[10px] font-semibold bg-white/10 px-2.5 py-1 rounded text-[#FBF6F0]/70">Visa</span>
            <span className="text-[10px] font-semibold bg-white/10 px-2.5 py-1 rounded text-[#FBF6F0]/70">Mastercard</span>
            <span className="text-[10px] font-semibold bg-white/10 px-2.5 py-1 rounded text-[#FBF6F0]/70">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}