'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import Image from 'next/image';

const DELIVERY_FEE = 40;

function OrangeBlossomDivider() {
  return (
    <svg viewBox="0 0 240 24" className="w-full h-6 my-2" fill="none" aria-hidden="true">
      <line x1="0" y1="12" x2="95" y2="12" stroke="#D4A574" strokeWidth="1" />
      <line x1="145" y1="12" x2="240" y2="12" stroke="#D4A574" strokeWidth="1" />
      <g transform="translate(120,12)">
        <circle r="2.2" fill="#B5704A" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-6" rx="2.6" ry="4.2"
            fill="none" stroke="#B5704A" strokeWidth="0.9"
            transform={`rotate(${deg})`} />
        ))}
      </g>
    </svg>
  );
}

function OrangeBlossomMark({ className = "w-4 h-4" }) {
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

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('whatsapp');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const subtotal = cart.reduce((acc, item) => {
    const price = parseInt(String(item.price).replace(/[^0-9]/g, '')) || 0;
    return acc + (price * (item.quantity || 1));
  }, 0);

  const deliveryFee = paymentMethod === 'whatsapp' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'online') {
      // Show QR code modal for Cash Plus payment
      setShowQR(true);
      return;
    }

    const items = cart.map(i => `• ${i.name} (x${i.quantity})`).join('%0A');
    const message = `*Nouvelle Commande*%0A%0A*Client:* ${formData.name}%0A*Tél:* ${formData.phone}%0A*Adresse:* ${formData.address}%0A%0A*Produits:*%0A${items}%0A%0A*Sous-total:* ${subtotal} MAD%0A*Livraison:* ${deliveryFee} MAD%0A*Total:* ${total} MAD`;

    try {
      sessionStorage.setItem('lastOrder', JSON.stringify({
        name: formData.name,
        items: cart.map(i => ({ name: i.name, quantity: i.quantity })),
        subtotal, deliveryFee, total,
      }));
    } catch (err) {
      console.error('Could not save order to session storage', err);
    }

    window.open(`https://wa.me/212XXXXXXXXXX?text=${message}`, '_blank');
    if (typeof clearCart === 'function') clearCart();
    router.push('/order-confirmation');
  };

  const handleQRConfirm = () => {
    // Customer scanned QR — save order and redirect
    try {
      sessionStorage.setItem('lastOrder', JSON.stringify({
        name: formData.name,
        items: cart.map(i => ({ name: i.name, quantity: i.quantity })),
        subtotal, deliveryFee: 0, total: subtotal,
        paymentMethod: 'online',
      }));
    } catch (err) {
      console.error(err);
    }
    if (typeof clearCart === 'function') clearCart();
    setShowQR(false);
    router.push('/order-confirmation');
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen py-24 px-6 bg-[#FBF6F0] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4A574]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#B5704A]/10 blur-3xl" />

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-[#1C1410]/60 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="bg-[#FBF6F0] rounded-[32px] p-10 max-w-sm w-full text-center border border-[#E8D9C5] shadow-[0_30px_60px_-15px_rgba(28,20,16,0.4)]">
            <p className="text-[#B5704A] uppercase tracking-[0.3em] text-[11px] font-semibold mb-3">
              Paiement Cash Plus
            </p>
            <h2 className="text-2xl text-[#1C1410] mb-2"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
              Scannez pour payer
            </h2>
            <p className="text-3xl font-light text-[#1C1410] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
              {total} <span className="text-lg text-[#B5704A]">MAD</span>
            </p>

            {/* QR Code Image — met cashplus-qr.png dans public/ */}
            <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-[#E8D9C5] mb-6 relative bg-white p-3">
              <Image
                src="/cashplus-qr.png"
                alt="Cash Plus QR Code"
                fill
                className="object-contain p-2"
              />
            </div>

            <p className="text-[#1C1410]/60 text-xs mb-8 leading-relaxed">
              Ouvrez votre application Cash Plus → Payer → Scanner ce QR code → Confirmer le paiement de <strong>{total} MAD</strong>
            </p>

            <div className="space-y-3">
              <button
                onClick={handleQRConfirm}
                className="w-full bg-[#1C1410] text-[#FBF6F0] py-4 rounded-full font-semibold uppercase tracking-[0.2em] text-sm hover:bg-[#B5704A] transition-colors flex items-center justify-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574]" />
                J'ai payé ✓
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="w-full text-[#7A4B3A]/60 text-sm hover:text-[#1C1410] transition-colors py-2"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto relative">
        <div className="mb-14 text-center">
          <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
            Maison Amina
          </p>
          <h1 className="text-5xl md:text-6xl tracking-tight text-[#1C1410] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
            Finaliser la commande
          </h1>
          <div className="max-w-xs mx-auto">
            <OrangeBlossomDivider />
          </div>
          <p className="text-[#7A4B3A]/70 text-sm tracking-wide">
            Vos rituels de beauté, livrés avec soin
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-10">

          {/* Order Summary */}
          <div className="md:col-span-5">
            <div className="bg-white/80 backdrop-blur-sm p-9 rounded-[28px] shadow-[0_8px_40px_-12px_rgba(28,20,16,0.12)] border border-[#E8D9C5] relative">
              <span className="absolute -top-3 left-8 bg-[#1C1410] text-[#D4A574] text-[10px] tracking-[0.25em] uppercase px-4 py-1.5 rounded-full font-semibold">
                Votre sélection
              </span>

              <div className="space-y-1 mt-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline py-3 text-sm">
                    <span className="text-[#1C1410]/80 flex-1 pr-3">
                      {item.name}
                      <span className="text-[#B5704A] font-semibold ml-2">×{item.quantity}</span>
                    </span>
                    <span className="flex-1 border-b border-dotted border-[#D4A574]/60 mx-2 mb-1" aria-hidden="true" />
                    <span className="font-medium text-[#1C1410] whitespace-nowrap">
                      {parseInt(String(item.price).replace(/[^0-9]/g, '')) * item.quantity} MAD
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3"><OrangeBlossomDivider /></div>

              <div className="flex justify-between items-center text-sm py-1.5">
                <span className="text-[#7A4B3A]/70">Sous-total</span>
                <span className="text-[#1C1410] font-medium">{subtotal} MAD</span>
              </div>

              <div className="flex justify-between items-center text-sm py-1.5">
                <span className="text-[#7A4B3A]/70 flex items-center gap-1.5">
                  Frais de livraison
                  {deliveryFee === 0 && (
                    <span className="text-[10px] uppercase tracking-wide bg-[#B5704A]/10 text-[#B5704A] px-2 py-0.5 rounded-full font-semibold">
                      Offerte
                    </span>
                  )}
                </span>
                <span className="text-[#1C1410] font-medium">
                  {deliveryFee === 0 ? '0 MAD' : `${deliveryFee} MAD`}
                </span>
              </div>

              <div className="flex justify-between items-end pt-4 mt-2 border-t border-dashed border-[#E8D9C5]">
                <span className="text-[#7A4B3A] uppercase tracking-[0.2em] text-xs font-semibold">Total</span>
                <span className="text-4xl text-[#1C1410]"
                  style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
                  {total} <span className="text-lg text-[#B5704A]">MAD</span>
                </span>
              </div>
            </div>
          </div>

          {/* Form + Payment */}
          <form onSubmit={handleSubmit}
            className="md:col-span-7 bg-white/80 backdrop-blur-sm p-10 md:p-12 rounded-[28px] shadow-[0_8px_40px_-12px_rgba(28,20,16,0.12)] border border-[#E8D9C5]">
            <h2 className="text-2xl text-[#1C1410] mb-1"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
              Informations de livraison
            </h2>
            <p className="text-[#7A4B3A]/60 text-xs uppercase tracking-[0.2em] mb-9">
              Pour vous joindre et vous livrer
            </p>

            <div className="space-y-7 mb-10">
              <div>
                <label className="text-[11px] uppercase text-[#7A4B3A]/70 font-semibold tracking-[0.2em] mb-2 block">
                  Nom complet
                </label>
                <input type="text" placeholder="Votre nom et prénom" required
                  className="w-full p-3.5 border-b-2 border-[#E8D9C5] bg-transparent text-[#1C1410] placeholder:text-[#1C1410]/25 focus:border-[#B5704A] outline-none transition-all duration-300"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] uppercase text-[#7A4B3A]/70 font-semibold tracking-[0.2em] mb-2 block">
                  Numéro de téléphone
                </label>
                <input type="tel" placeholder="06 XX XX XX XX" required
                  className="w-full p-3.5 border-b-2 border-[#E8D9C5] bg-transparent text-[#1C1410] placeholder:text-[#1C1410]/25 focus:border-[#B5704A] outline-none transition-all duration-300"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] uppercase text-[#7A4B3A]/70 font-semibold tracking-[0.2em] mb-2 block">
                  Adresse complète
                </label>
                <textarea placeholder="Ville, quartier, rue, numéro..." rows="2" required
                  className="w-full p-3.5 border-b-2 border-[#E8D9C5] bg-transparent text-[#1C1410] placeholder:text-[#1C1410]/25 focus:border-[#B5704A] outline-none transition-all duration-300 resize-none"
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
            </div>

            {/* Payment method selection */}
            <div className="mb-10">
              <label className="text-[11px] uppercase text-[#7A4B3A]/70 font-semibold tracking-[0.2em] mb-4 block">
                Mode de paiement
              </label>
              <div className="space-y-3">

                {/* Online — Cash Plus QR — NOW ACTIVE */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    paymentMethod === 'online'
                      ? 'border-[#B5704A] bg-[#B5704A]/5'
                      : 'border-[#E8D9C5] bg-transparent hover:border-[#D4A574]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className={`w-4 h-4 rounded-full border-2 mt-1 shrink-0 flex items-center justify-center transition-colors ${
                        paymentMethod === 'online' ? 'border-[#B5704A]' : 'border-[#D4A574]'
                      }`}>
                        {paymentMethod === 'online' && <span className="w-2 h-2 rounded-full bg-[#B5704A]" />}
                      </span>
                      <div>
                        <p className="text-[#1C1410] font-medium text-sm flex items-center gap-2">
                          Paiement en ligne — Cash Plus QR
                          <span className="text-[9px] uppercase tracking-[0.15em] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Disponible
                          </span>
                        </p>
                        <p className="text-[#7A4B3A]/60 text-xs mt-1">
                          Livraison <strong className="text-[#B5704A]">gratuite</strong> — Scannez le QR code pour payer instantanément
                        </p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* WhatsApp / COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    paymentMethod === 'whatsapp'
                      ? 'border-[#B5704A] bg-[#B5704A]/5'
                      : 'border-[#E8D9C5] bg-transparent hover:border-[#D4A574]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-4 h-4 rounded-full border-2 mt-1 shrink-0 flex items-center justify-center transition-colors ${
                      paymentMethod === 'whatsapp' ? 'border-[#B5704A]' : 'border-[#D4A574]'
                    }`}>
                      {paymentMethod === 'whatsapp' && <span className="w-2 h-2 rounded-full bg-[#B5704A]" />}
                    </span>
                    <div>
                      <p className="text-[#1C1410] font-medium text-sm">Commande via WhatsApp</p>
                      <p className="text-[#7A4B3A]/60 text-xs mt-1">
                        Paiement à la livraison — {DELIVERY_FEE} MAD de frais de livraison
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <button type="submit"
              className="group w-full bg-[#1C1410] text-[#FBF6F0] py-5 rounded-full font-semibold uppercase tracking-[0.25em] text-sm hover:bg-[#B5704A] transition-colors duration-300 active:scale-[0.98] shadow-lg flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574] group-hover:bg-[#FBF6F0] transition-colors" />
              {paymentMethod === 'online' ? 'Voir le QR Code →' : 'Confirmer la commande'}
            </button>

            <p className="text-center text-[#7A4B3A]/50 text-[10px] uppercase tracking-[0.2em] mt-5">
              {paymentMethod === 'online'
                ? 'Paiement sécurisé via Cash Plus'
                : 'Commande envoyée directement via WhatsApp'}
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}