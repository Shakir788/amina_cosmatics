'use client';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useEffect, useState } from 'react';

export default function WishlistBtn({ product }) {
  const [mounted, setMounted] = useState(false);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product._id));

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
      className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1C1410] hover:text-[#B5704A] hover:scale-110 active:scale-95 transition-all shadow-sm border border-[#E8D9C5] z-10"
    >
      <Heart className={`w-5 h-5 transition-colors ${isInWishlist ? 'fill-[#B5704A] text-[#B5704A]' : 'fill-none'}`} />
    </button>
  );
}