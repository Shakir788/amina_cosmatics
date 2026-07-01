'use client';
import { useCartStore } from '../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
// useRouter hata diya kyunki ab hum direct WhatsApp pe bhejenge
import { FaWhatsapp } from 'react-icons/fa'; // WhatsApp icon ke liye

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

export default function CartDrawer() {
  const { isOpen, closeCart, cart, updateQuantity } = useCartStore();

  const totalPrice = cart.reduce((acc, item) => {
    const priceString = String(item.price);
    const numericPrice = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
    return acc + (numericPrice * (item.quantity || 1));
  }, 0);

  // --- NAYA WHATSAPP CHECKOUT LOGIC ---
  const handleCheckout = () => {
    if (cart.length === 0) return;

    // 1. Ek sundar sa message format banao
    let message = "Bonjour Cosmétiques Amina ! 🌸\nJe souhaite commander :\n\n";
    
    cart.forEach((item) => {
      message += `▪ ${item.quantity}x ${item.name} (${item.price})\n`;
    });

    message += `\n*Total estimé : ${totalPrice} MAD*\n\nMerci !`;

    // 2. Message ko URL ke liye encode karo
    const encodedMessage = encodeURIComponent(message);
    
    // 3. Tere number ke sath WhatsApp link banao
    const whatsappUrl = `https://wa.me/212723908603?text=${encodedMessage}`;

    // 4. Naye tab mein WhatsApp open karo aur drawer band kardo
    window.open(whatsappUrl, '_blank');
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#1C1410]/40 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#FBF6F0] z-50 p-7 shadow-[-20px_0_60px_-15px_rgba(28,20,16,0.3)] flex flex-col border-l border-[#E8D9C5]"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <OrangeBlossomMark className="w-3.5 h-3.5 text-[#B5704A]" />
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#7A4B3A]">
                  Votre Panier
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Fermer le panier"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1C1410]/60 hover:text-[#1C1410] hover:bg-[#E8D9C5]/50 transition-colors"
              >
                ✕
              </button>
            </div>

            <h3
              className="text-3xl text-[#1C1410] mb-7"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              {cart.length > 0
                ? `${cart.length} article${cart.length > 1 ? 's' : ''}`
                : 'Panier vide'}
            </h3>

            <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center mt-20 gap-3">
                  <OrangeBlossomMark className="w-8 h-8 text-[#D4A574]" />
                  <p className="text-[#7A4B3A]/60 text-center text-sm italic">
                    Votre panier attend sa première sélection.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-white/70 border border-[#E8D9C5] rounded-2xl px-4 py-3.5"
                  >
                    <div className="flex flex-col min-w-0 pr-3">
                      <h4 className="font-medium text-[#1C1410] text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-[#B5704A] font-medium mt-0.5">{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-[#FBF6F0] border border-[#E8D9C5] rounded-full px-3 py-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Diminuer la quantité"
                        className="text-[#7A4B3A]/70 hover:text-[#1C1410] font-semibold text-base leading-none"
                      >
                        −
                      </button>
                      <span className="font-semibold text-sm w-4 text-center text-[#1C1410]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Augmenter la quantité"
                        className="text-[#7A4B3A]/70 hover:text-[#1C1410] font-semibold text-base leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total and Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-[#E8D9C5] pt-6 mt-5">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#7A4B3A] font-semibold">
                    Total
                  </span>
                  <span
                    className="text-3xl text-[#1C1410]"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
                  >
                    {totalPrice} <span className="text-base text-[#B5704A]">MAD</span>
                  </span>
                </div>
                {/* Button updated for WhatsApp */}
                <button
                  onClick={handleCheckout}
                  className="group w-full bg-[#1C1410] text-[#FBF6F0] py-4.5 rounded-full font-semibold uppercase tracking-[0.15em] text-[11px] hover:bg-[#B5704A] transition-colors duration-300 active:scale-[0.97] shadow-lg flex items-center justify-center gap-3"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  Commander via WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}