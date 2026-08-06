"use client";
import Image from 'next/image';
import { useRef } from 'react';

// SVG props ke liye type
function OrangeBlossomMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="12" cy="6.5" rx="2" ry="3.4" fill="none" stroke="currentColor" strokeWidth="1" transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
}

// ✨ Media list me jo items aayenge unka type
interface MediaItem {
  id: string;
  type: string;
  url: string;
}

// ✨ Component me jo Data (props) aayega uska type
interface ProductCarouselProps {
  mediaList: MediaItem[];
  hasDiscount: boolean | null;
  discountPercentage: number;
  isOutOfStock: boolean;
}

export default function ProductCarousel({ mediaList, hasDiscount, discountPercentage, isOutOfStock }: ProductCarouselProps) {
  // ✨ useRef ko bataya ki ye ek Div element hai
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✨ direction ko bataya ki wo sirf 'left' ya 'right' ho sakta hai
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative aspect-[9/16] w-full max-h-[85vh] rounded-[28px] overflow-hidden bg-[#F0E4D4] shadow-[0_20px_60px_-15px_rgba(28,20,16,0.25)] ring-1 ring-[#E8D9C5] group">

      {/* Desktop Arrows */}
      {mediaList.length > 1 && (
        <>
          <button onClick={() => scroll('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-[#FBF6F0]/90 p-3 rounded-full shadow-lg hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-[#1C1410]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button onClick={() => scroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-[#FBF6F0]/90 p-3 rounded-full shadow-lg hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-[#1C1410]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </>
      )}

      {/* Media Container */}
      <div
        ref={scrollRef}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mediaList.length > 0 ? (
          mediaList.map((item: MediaItem, index: number) => ( // ✨ item aur index ko types diye
            <div key={item.id} className="snap-center shrink-0 w-full h-full relative">
              {item.type === 'video' ? (
                <video src={item.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <Image src={item.url} alt="Product Image" fill className="object-cover object-center" priority={index === 0} sizes="(max-width: 768px) 100vw, 50vw" />
              )}
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#7A4B3A]/50 text-sm">Aucun média</div>
        )}
      </div>

      {/* Badges */}
      {hasDiscount && (
        <div className="absolute top-6 right-6 z-20 bg-[#B5704A] text-[#FBF6F0] text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 pointer-events-none">
          <OrangeBlossomMark className="w-3 h-3 text-[#D4A574]" />
          -{discountPercentage}%
        </div>
      )}

      {isOutOfStock && (
        <div className="absolute inset-0 z-30 bg-[#FBF6F0]/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <span className="bg-[#1C1410] text-[#D4A574] text-xs uppercase tracking-[0.25em] px-6 py-3 rounded-full font-semibold shadow-xl">Épuisé</span>
        </div>
      )}
    </div>
  );
}