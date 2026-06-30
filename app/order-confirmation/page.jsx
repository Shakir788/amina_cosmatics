'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function OrangeBlossomMark({ className = "w-8 h-8" }) {
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

function OrangeBlossomDivider() {
  return (
    <div className="flex items-center justify-center gap-3 max-w-xs mx-auto" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4A574]" />
      <OrangeBlossomMark className="w-4 h-4 text-[#B5704A]" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A574]" />
    </div>
  );
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('lastOrder');
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Could not read order from session storage', e);
    }

    // Simple human-friendly order reference (not a database ID)
    const ref = `AM-${Date.now().toString().slice(-6)}`;
    setOrderNumber(ref);
  }, []);

  return (
    <main className="min-h-screen py-28 px-6 bg-[#FBF6F0] relative overflow-hidden flex items-center">
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4A574]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#B5704A]/10 blur-3xl" />

      <div className="max-w-lg mx-auto relative w-full">
        <div className="bg-white/80 backdrop-blur-sm p-10 md:p-14 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(28,20,16,0.15)] border border-[#E8D9C5] text-center">

          <div className="w-16 h-16 rounded-full bg-[#B5704A]/10 flex items-center justify-center mx-auto mb-6">
            <OrangeBlossomMark className="w-8 h-8 text-[#B5704A]" />
          </div>

          <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
            Commande envoyée
          </p>

          <h1
            className="text-4xl text-[#1C1410] tracking-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            Merci{order?.name ? `, ${order.name.split(' ')[0]}` : ''} !
          </h1>

          <div className="mb-6">
            <OrangeBlossomDivider />
          </div>

          <p className="text-[#1C1410]/65 leading-relaxed mb-8 max-w-sm mx-auto">
            Votre commande a été transmise via WhatsApp. Notre équipe vous contactera très bientôt pour confirmer la livraison.
          </p>

          {/* Order reference */}
          <div className="bg-[#FBF6F0] border border-[#E8D9C5] rounded-2xl py-4 px-6 mb-8 inline-block">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A4B3A]/60 font-semibold mb-1">
              Référence
            </p>
            <p className="text-[#1C1410] font-semibold tracking-wide">{orderNumber}</p>
          </div>

          {/* Order summary, if available */}
          {order && order.items?.length > 0 && (
            <div className="text-left mb-10 bg-[#FBF6F0]/60 border border-[#E8D9C5] rounded-2xl p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A4B3A]/60 font-semibold mb-4">
                Récapitulatif
              </p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-[#1C1410]/75">
                      {item.name} <span className="text-[#B5704A] font-medium">×{item.quantity}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-dashed border-[#E8D9C5]">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#7A4B3A] font-semibold">
                  Total
                </span>
                <span
                  className="text-2xl text-[#1C1410]"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                >
                  {order.total} <span className="text-sm text-[#B5704A]">MAD</span>
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-[#1C1410] text-[#FBF6F0] px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:bg-[#B5704A] transition-colors duration-300"
            >
              Continuer mes achats
            </Link>
            <a
              href="https://wa.me/212XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#E8D9C5] text-[#1C1410] px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:border-[#B5704A] hover:text-[#B5704A] transition-colors duration-300"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}