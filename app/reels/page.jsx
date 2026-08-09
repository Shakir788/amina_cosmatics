'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ShoppingBag, Volume2, VolumeX, X, Play, ChevronUp, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { client } from '../../sanity/client';

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

// Persist likes in localStorage so they survive refresh
function useLikes() {
  const [likedIds, setLikedIds] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('amina-liked-reels');
      if (saved) setLikedIds(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('amina-liked-reels', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return { likedIds, toggleLike };
}

export default function ReelsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const router = useRouter();

  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);
  const { likedIds, toggleLike } = useLikes();

  useEffect(() => {
    client.fetch(`
      *[_type == "cosmeticProduct" && (defined(videoFile.asset) || defined(videoUrl))] | order(_createdAt desc) {
        _id, name, name_fr, slug, price, image,
        "uploadedVideoUrl": videoFile.asset->url,
        videoUrl
      }
    `).then((data) => {
      setProducts(data.filter(p => p.uploadedVideoUrl || p.videoUrl));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Track which reel is in view (scroll-snap based)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const idx = Math.round(container.scrollTop / container.clientHeight);
      setActiveIndex(idx);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [products]);

  // Scroll to a specific slide index
  const scrollToIndex = (idx) => {
    const container = containerRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(products.length - 1, idx));
    container.scrollTo({ top: clamped * container.clientHeight, behavior: 'smooth' });
  };

  const goNext = () => scrollToIndex(activeIndex + 1);
  const goPrev = () => scrollToIndex(activeIndex - 1);

  // Keyboard navigation — Up/Down/PageUp/PageDown arrows, Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        router.push('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, products.length]);

  // Lock body scroll while reels page is open, and hide the global navbar
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('reels-page-active');
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('reels-page-active');
    };
  }, []);

  const handleShare = async (product) => {
    const url = `${window.location.origin}/product/${product.slug?.current}`;
    const shareData = {
      title: product.name_fr || product.name,
      text: `Découvrez ${product.name_fr || product.name} sur Cosmétiques Amina`,
      url,
    };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Lien copié ! 📋');
      } catch {}
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#1C1410] flex items-center justify-center z-[200]">
        <OrangeBlossomMark className="w-8 h-8 text-[#D4A574] animate-pulse" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#1C1410] flex flex-col items-center justify-center z-[200] px-6 text-center">
        <OrangeBlossomMark className="w-8 h-8 text-[#D4A574] mb-4" />
        <p className="text-[#FBF6F0] text-sm mb-6">Aucune vidéo disponible pour le moment.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-white text-[#1C1410] px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[200]">
      {/* Force-hide the global navbar while this page is open */}
      <style jsx global>{`
        body.reels-page-active nav {
          display: none !important;
        }
      `}</style>

      {/* Close button */}
      <button
        onClick={() => router.push('/')}
        aria-label="Fermer"
        className="fixed top-5 right-5 z-[210] w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Desktop up/down navigation buttons */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-[210] flex-col gap-3">
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="Vidéo précédente"
          className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          disabled={activeIndex === products.length - 1}
          aria-label="Vidéo suivante"
          className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Vertical swipe container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, idx) => (
          <ReelSlide
            key={product._id}
            product={product}
            isActive={idx === activeIndex}
            isLiked={likedIds.includes(product._id)}
            onToggleLike={() => toggleLike(product._id)}
            onShare={() => handleShare(product)}
            onAddToCart={() => {
              addToCart({ id: product._id, name: product.name_fr || product.name, price: `${product.price} MAD` });
              openCart();
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ReelSlide({ product, isActive, isLiked, onToggleLike, onShare, onAddToCart }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const videoSrc = product.uploadedVideoUrl || product.videoUrl;
  const name = product.name_fr || product.name;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked or interrupted — safe to ignore
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

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

  const handleDoubleClick = () => {
    if (!isLiked) onToggleLike();
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 800);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="h-full w-full snap-start snap-always relative flex items-center justify-center">
      <div
        className="relative w-full h-full max-w-[480px] mx-auto"
        onClick={togglePlay}
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

        {/* Double-tap heart burst */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <Heart className="w-24 h-24 text-[#B5704A] fill-[#B5704A]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play icon when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
              <Play className="w-6 h-6 ml-1" />
            </div>
          </div>
        )}

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="absolute top-5 left-5 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 hover:text-white transition-colors z-20"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Right-side action rail — like Instagram/TikTok */}
        <div
          className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onToggleLike} className="flex flex-col items-center gap-1 group">
            <div className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 ${
              isLiked ? 'bg-[#B5704A]' : 'bg-white/15 group-hover:bg-white/25'
            }`}>
              <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'text-white fill-white' : 'text-white'}`} />
            </div>
            <span className="text-white text-[10px] font-medium drop-shadow">
              {isLiked ? 'Aimé' : "J'aime"}
            </span>
          </button>

          <button onClick={onShare} className="flex flex-col items-center gap-1 group">
            <div className="w-11 h-11 rounded-full bg-white/15 group-hover:bg-white/25 backdrop-blur-md flex items-center justify-center transition-all active:scale-90">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-[10px] font-medium drop-shadow">Partager</span>
          </button>
        </div>

        {/* Bottom shoppable product card */}
        <div
          className="absolute bottom-6 left-4 right-16 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between shadow-xl border border-white/40">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B5704A] font-bold mb-1 flex items-center gap-1.5">
                <OrangeBlossomMark className="w-2.5 h-2.5" />
                Acheter le look
              </p>
              <h4 className="font-medium text-[#1C1410] text-sm truncate">{name}</h4>
              <p className="text-[#1C1410] font-semibold text-xs mt-0.5">{product.price} MAD</p>
            </div>
            <button
              onClick={onAddToCart}
              className="w-12 h-12 shrink-0 bg-[#1C1410] text-[#FBF6F0] rounded-xl flex items-center justify-center hover:bg-[#B5704A] transition-colors active:scale-95 shadow-md"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}