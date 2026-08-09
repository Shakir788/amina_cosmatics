'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ShoppingBag, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../store/useCartStore';

export default function ReelsSection({ products = [] }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);

  const videoProducts = products.filter(
    (p) => p.uploadedVideoUrl || p.videoUrl
  );

  if (videoProducts.length === 0) {
    return null; 
  }

  return (
    <section className="py-24">
      <div className="flex items-center justify-between mb-12 px-6 md:px-0">
        <h2 className="text-3xl font-bold text-[#1C1410] tracking-tight">
          Découvrir en Vidéo
        </h2>

        {/* Link to full-screen reels experience */}
        <Link
          href="/reels"
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#B5704A] hover:text-[#1C1410] transition-colors group"
        >
          <span className="hidden sm:inline">Voir tout</span>
          <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </Link>
      </div>
      
      <div 
        className="flex gap-6 overflow-x-auto pb-12 pt-4 px-6 md:px-0 snap-x snap-mandatory items-center scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videoProducts.map((product) => (
          <ReelCard 
            key={product._id} 
            product={product} 
            onAdd={() => {
              addToCart({ 
                id: product._id, 
                name: product.name, 
                price: `${product.price} MAD`, 
                quantity: 1 
              });
              openCart();
            }} 
          />
        ))}
      </div>
    </section>
  );
}

function ReelCard({ product, onAdd }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const videoSrc = product.uploadedVideoUrl || product.videoUrl;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative aspect-[9/16] h-[500px] sm:h-[570px] shrink-0 snap-center rounded-[32px] overflow-hidden shadow-2xl border border-[#E8D9C5]/50 bg-[#1C1410] cursor-pointer group"
      onClick={togglePlay}
    >
      <Link
        href="/reels"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-5 left-5 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
        title="Voir en plein écran"
      >
        <Maximize2 className="w-4 h-4" />
      </Link>

      <video 
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 pointer-events-none"></div>

      <button 
        onClick={toggleMute} 
        className="absolute top-5 right-5 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <Play className="w-6 h-6 ml-1" />
          </div>
        </div>
      )}

      <div 
        className="absolute bottom-5 left-4 right-4 z-20"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between shadow-xl border border-white/40 transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5704A] font-bold mb-1">
              Acheter le look
            </p>
            <h4 className="font-medium text-[#1C1410] text-sm truncate">
              {product.name}
            </h4>
            <p className="text-[#1C1410] font-semibold text-xs mt-0.5">
              {product.price} MAD
            </p>
          </div>
          <button 
            onClick={onAdd}
            className="w-12 h-12 shrink-0 bg-[#1C1410] text-[#FBF6F0] rounded-xl flex items-center justify-center hover:bg-[#B5704A] transition-colors active:scale-95 shadow-md"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}