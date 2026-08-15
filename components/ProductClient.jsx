'use client';
import Link from 'next/link';
import AddToCartBtn from './AddToCartBtn';
import ProductCarousel from './ProductCarousel';
import { useLangStore } from '../store/useLangStore';

function OrangeBlossomMark({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="12" cy="6.5" rx="2" ry="3.4" fill="none" stroke="currentColor" strokeWidth="1" transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
}

export default function ProductClient({ product, mediaList }) {
  const t = useLangStore((state) => state.t);
  const lang = useLangStore((state) => state.lang);
  const isArabic = lang === 'AR';

  const currentPrice = Number(product.price);
  const oldPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const isOutOfStock = product.inStock === false;
  const hasDiscount = oldPrice && oldPrice > currentPrice && !isOutOfStock;
  const discountPercentage = hasDiscount ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

  // 🌟 Smart Logic: Sanity se sahi language ka field uthane ke liye
  const getLocalized = (field) => {
    // Description ke liye special check (kyunki Sanity schema mein naam desc_ar aur desc_fr hai)
    if (field === 'description') {
      if (lang === 'AR') return product.desc_ar || product.description;
      if (lang === 'FR') return product.desc_fr || product.description;
      return product.description;
    }
    
    // Baaki fields (jaise name) ke liye normal check (name_ar, name_fr)
    if (lang === 'AR') return product[`${field}_ar`] || product[field];
    if (lang === 'FR') return product[`${field}_fr`] || product[field];
    return product[field]; // Default English / Fallback
  };

  return (
    <main dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FBF6F0] py-24 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4A574]/15 blur-3xl" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative">
        <div className="mb-10 text-[11px] font-semibold text-[#7A4B3A]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <Link href="/" className="hover:text-[#B5704A] transition-colors">{t('navHome')}</Link>
          <span>/</span>
          <span className="text-[#B5704A]">{getLocalized('category') || "Soins"}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start relative">
          <div className="w-full md:w-1/2">
            <div className="sticky top-24">
              <ProductCarousel 
                mediaList={mediaList} 
                hasDiscount={hasDiscount} 
                discountPercentage={discountPercentage} 
                isOutOfStock={isOutOfStock} 
              />
              
              {mediaList.length > 1 && (
                <div className="md:hidden mt-4 flex items-center justify-center gap-2 w-full">
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#B5704A]/80 bg-[#E8D9C5]/50 px-4 py-1.5 rounded-full shadow-sm">
                    {t('swipeMore')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={`w-full md:w-1/2 flex flex-col pt-4 ${isArabic ? 'text-right' : 'text-left'}`}>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B5704A] font-semibold mb-4">
              {getLocalized('category')}
            </span>
            <h1 className="text-4xl md:text-5xl text-[#1C1410] mb-6 leading-[1.05] tracking-tight" style={{ fontFamily: isArabic ? 'system-ui, sans-serif' : "'Cormorant Garamond', 'Playfair Display', serif" }}>
              {getLocalized('name')}
            </h1>
            
            <div className={`flex items-center gap-3 mb-8 ${isArabic ? 'justify-end' : 'justify-start'}`}>
              <p className="text-3xl text-[#1C1410]" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
                {currentPrice} <span className="text-base text-[#B5704A]">MAD</span>
              </p>
              {oldPrice && !isOutOfStock && <p className="text-base text-[#7A4B3A]/45 line-through font-medium">{oldPrice} MAD</p>}
            </div>
            
            <p className="text-[#1C1410]/65 mb-10 leading-relaxed max-w-md whitespace-pre-line">
              {getLocalized('description') || t('defaultDesc')}
            </p>
            
            <div className={`max-w-xs ${isArabic ? 'mr-auto' : ''}`}>
              <AddToCartBtn product={product} />
            </div>
            
            <div className={`grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-[#E8D9C5] max-w-md ${isArabic ? 'mr-0' : ''}`}>
              <div className={`flex flex-col gap-2 ${isArabic ? 'items-end' : 'items-start'}`}>
                <OrangeBlossomMark className="w-5 h-5 text-[#D4A574]" />
                <p className="text-[11px] text-[#1C1410]/70 leading-tight">{t('delivery')}</p>
              </div>
              <div className={`flex flex-col gap-2 ${isArabic ? 'items-end' : 'items-start'}`}>
                <OrangeBlossomMark className="w-5 h-5 text-[#D4A574]" />
                <p className="text-[11px] text-[#1C1410]/70 leading-tight">{t('authentic')}</p>
              </div>
              <div className={`flex flex-col gap-2 ${isArabic ? 'items-end' : 'items-start'}`}>
                <OrangeBlossomMark className="w-5 h-5 text-[#D4A574]" />
                <p className="text-[11px] text-[#1C1410]/70 leading-tight">{t('returns')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}