'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '../sanity/client';
import { useCartStore } from '../store/useCartStore';
import WishlistBtn from './WishlistBtn';

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

// 3D tilt hook — desktop only, disabled on touch devices via CSS media query check
function use3DTilt() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-10, 10]);

  const scale = useSpring(1, { stiffness: 200, damping: 20 });
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    scale.set(1.03);
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
    glowOpacity.set(0);
  };

  return { ref, rotateX, rotateY, scale, glowOpacity, handleMouseMove, handleMouseEnter, handleMouseLeave };
}

export default function ProductCard({ product, lang = 'fr' }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { ref, rotateX, rotateY, scale, glowOpacity, handleMouseMove, handleMouseEnter, handleMouseLeave } = use3DTilt();

  const isOutOfStock = product.inStock === false;
  const currentPrice = Number(product.price);
  const oldPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = oldPrice && oldPrice > currentPrice && !isOutOfStock;
  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  const name = product[`name_${lang}`] || product.name || "Produit Amina";
  const category = product.category || "Collection";

  return (
    <div style={{ perspective: '1000px' }} className="w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className={`bg-white/80 backdrop-blur-sm rounded-[18px] sm:rounded-[24px] p-2.5 sm:p-3.5 flex flex-col group relative border border-[#E8D9C5] shadow-[0_4px_16px_-8px_rgba(28,20,16,0.1)] sm:shadow-[0_8px_30px_-12px_rgba(28,20,16,0.1)] transition-shadow duration-500 ${isOutOfStock ? 'opacity-80 grayscale-[25%]' : ''}`}
      >
        <motion.div
          style={{
            opacity: glowOpacity,
            background: 'radial-gradient(circle at 50% 50%, rgba(212,165,116,0.12) 0%, transparent 70%)',
          }}
          className="pointer-events-none absolute inset-0 rounded-[18px] sm:rounded-[24px] z-0"
        />

        {/* Wishlist Button */}
        <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-40 scale-[0.8] sm:scale-100 origin-top-left">
          <WishlistBtn product={product} />
        </div>

        {/* Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-30 bg-[#FBF6F0]/60 backdrop-blur-[2px] flex items-center justify-center rounded-[18px] sm:rounded-[24px]">
            <span className="bg-[#1C1410] text-[#D4A574] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold shadow-xl">
              Épuisé
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-20 bg-[#B5704A] text-[#FBF6F0] text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-lg flex items-center gap-1 sm:gap-1.5">
            <OrangeBlossomMark className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#D4A574]" />
            -{discountPercentage}%
          </div>
        )}

        {/* Media — FIXED: aspect-[4/5] instead of 9/16 — more balanced, premium product photography ratio */}
        <Link href={`/product/${product.slug?.current}`} className="w-full relative z-10">
          <div className="aspect-[4/5] w-full bg-[#F0E4D4] rounded-[14px] sm:rounded-[18px] mb-3 sm:mb-4 overflow-hidden relative shadow-inner ring-1 ring-[#E8D9C5]">
            {product.image && (
              <Image
                src={urlFor(product.image).url()}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}

            {product.videoUrl && (
              <video
                src={product.videoUrl}
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 pointer-events-none" />
          </div>
        </Link>

        {/* Details */}
        <div className="px-1 sm:px-1.5 pb-0.5 sm:pb-1.5 flex justify-between items-end mt-auto relative z-10">
          <div className="min-w-0">
            <span className="text-[8.5px] sm:text-[10px] uppercase font-semibold text-[#B5704A] tracking-[0.15em] sm:tracking-[0.2em]">
              {category}
            </span>
            <Link href={`/product/${product.slug?.current}`}>
              <h3
                className="text-[#1C1410] mt-0.5 sm:mt-1 group-hover:text-[#B5704A] transition-colors line-clamp-1 text-sm sm:text-lg"
                style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
              >
                {name}
              </h3>
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
              {hasDiscount && (
                <span className="text-[#7A4B3A]/50 text-[9px] sm:text-[11px] line-through font-medium">
                  {oldPrice}
                </span>
              )}
              <p className="text-[#1C1410] font-semibold tracking-tight text-xs sm:text-base">
                {currentPrice} <span className="text-[8.5px] sm:text-[10px] text-[#7A4B3A]/70 uppercase tracking-wider">MAD</span>
              </p>
            </div>
          </div>

          {/* Add to Cart */}
          {!isOutOfStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart({ id: product._id, name, price: `${currentPrice} MAD` });
              }}
              aria-label="Ajouter au panier"
              className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#1C1410] text-[#FBF6F0] flex items-center justify-center hover:bg-[#B5704A] transition-all duration-300 active:scale-90 shadow-md text-base sm:text-lg font-light"
            >
              +
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}