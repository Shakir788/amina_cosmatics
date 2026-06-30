'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '../sanity/client'; 
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

export default function ProductCard({ product, lang = 'fr' }) {
  const addToCart = useCartStore((state) => state.addToCart);

  // VIP Logic: Stock and Exact Discount Calculation
  const isOutOfStock = product.inStock === false;
  const currentPrice = Number(product.price);
  const oldPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = oldPrice && oldPrice > currentPrice && !isOutOfStock;

  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  // Multi-language Name Support
  const name = product[`name_${lang}`] || product.name || "Produit Amina";
  const category = product.category || "Collection";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`bg-white/80 backdrop-blur-sm rounded-[28px] p-4 flex flex-col group relative border border-[#E8D9C5] shadow-[0_8px_30px_-12px_rgba(28,20,16,0.1)] hover:shadow-[0_16px_40px_-12px_rgba(28,20,16,0.18)] transition-shadow duration-500 ${isOutOfStock ? 'opacity-80 grayscale-[25%]' : ''}`}
    >
      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 z-30 bg-[#FBF6F0]/60 backdrop-blur-[2px] flex items-center justify-center rounded-[28px]">
          <span className="bg-[#1C1410] text-[#D4A574] text-[10px] uppercase tracking-[0.25em] px-5 py-2.5 rounded-full font-semibold shadow-xl">
            Épuisé
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-8 right-8 z-20 bg-[#B5704A] text-[#FBF6F0] text-[10px] font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <OrangeBlossomMark className="w-2.5 h-2.5 text-[#D4A574]" />
          -{discountPercentage}%
        </div>
      )}

      {/* Media Link */}
      <Link href={`/product/${product.slug?.current}`} className="w-full">
        <div className="aspect-[9/16] w-full bg-[#F0E4D4] rounded-[20px] mb-5 overflow-hidden relative shadow-inner ring-1 ring-[#E8D9C5]">

          {product.image && (
            <Image
              src={urlFor(product.image).url()}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 z-10"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )}

          {product.videoUrl && (
            <video
              src={product.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 pointer-events-none" />
        </div>
      </Link>

      {/* Details Section */}
      <div className="px-2 pb-2 flex justify-between items-end mt-auto relative z-40">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-semibold text-[#B5704A] tracking-[0.2em]">
            {category}
          </span>
          <Link href={`/product/${product.slug?.current}`}>
            <h3
              className="text-[#1C1410] mt-1.5 group-hover:text-[#B5704A] transition-colors line-clamp-1 text-xl"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              {name}
            </h3>
          </Link>

          {/* Price Row */}
          <div className="flex items-center gap-2 mt-2">
            {hasDiscount && (
              <span className="text-[#7A4B3A]/50 text-[11px] line-through font-medium">
                {oldPrice}
              </span>
            )}
            <p className="text-[#1C1410] font-semibold tracking-tight">
              {currentPrice} <span className="text-[10px] text-[#7A4B3A]/70 uppercase tracking-wider">MAD</span>
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
            className="w-11 h-11 shrink-0 rounded-full bg-[#1C1410] text-[#FBF6F0] flex items-center justify-center hover:bg-[#B5704A] transition-all duration-300 active:scale-90 shadow-md text-lg font-light"
          >
            +
          </button>
        )}
      </div>
    </motion.div>
  );
}
