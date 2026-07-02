'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const REELS_DATA = [
  { id: 'r1', video: "https://www.pexels.com/download/video/7614789/", product: { _id: "prod_1", name: "Sérum Éclat Vitamine C", price: 350 } },
  { id: 'r2', video: "https://www.pexels.com/download/video/7428167/", product: { _id: "prod_2", name: "Crème Hydratante Intense", price: 280 } },
  { id: 'r3', video: "https://www.pexels.com/download/video/7316967/", product: { _id: "prod_3", name: "Huile Scintillante Corps", price: 420 } },
  { id: 'r4', video: "https://www.pexels.com/download/video/5937378/", product: { _id: "prod_4", name: "Masque Purifiant Argile", price: 210 } },
  { id: 'r5', video: "https://www.pexels.com/download/video/7428171/", product: { _id: "prod_5", name: "Eau de Rose Bio", price: 150 } },
  { id: 'r6', video: "https://www.pexels.com/download/video/7852689/", product: { _id: "prod_6", name: "Sérum Rétinol Nuit", price: 450 } },
  { id: 'r7', video: "https://www.pexels.com/download/video/8479189/", product: { _id: "prod_7", name: "Baume à Lèvres Teinté", price: 90 } },
  { id: 'r8', video: "https://www.pexels.com/download/video/8479090/", product: { _id: "prod_8", name: "Gommage Doux Visage", price: 180 } },
];

export default function ReelsSection() {
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);

  return (
    <section className="py-24">
      <h2 className="text-3xl font-bold text-[#1C1410] mb-12 tracking-tight px-6 md:px-0">
        Découvrir en Vidéo
      </h2>
      
      {/* Horizontal scrollable container */}
      <div className="flex gap-6 overflow-x-auto pb-12 pt-4 px-6 md:px-0 scrollbar-hide snap-x snap-mandatory items-center">
        {REELS_DATA.map((reel) => (
          <ReelCard 
            key={reel.id} 
            reel={reel} 
            onAdd={() => {
              addToCart({ id: reel.product._id, name: reel.product.name, price: `${reel.product.price} MAD`, quantity: 1 });
              openCart();
            }} 
          />
        ))}
      </div>
    </section>
  );
}

function ReelCard({ reel, onAdd }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      // THE FIX: Strict Width & Height for 9:16 Portrait Format
      className="relative w-[280px] sm:w-[320px] h-[500px] sm:h-[570px] shrink-0 snap-center rounded-[32px] overflow-hidden shadow-2xl border border-[#E8D9C5]/50 bg-[#1C1410] cursor-pointer group"
      onClick={togglePlay}
    >
      <video 
        ref={videoRef}
        src={reel.video}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        // object-cover is crucial here. It forces landscape videos to fill the vertical frame properly.
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      {/* Dark gradient overlay for bottom text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 pointer-events-none"></div>

      {/* Mute/Unmute Button */}
      <button 
        onClick={toggleMute} 
        className="absolute top-5 right-5 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Play Icon when Paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <Play className="w-6 h-6 ml-1" />
          </div>
        </div>
      )}

      {/* THE MONEY MAKER: Shoppable Product Card Overlay */}
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
              {reel.product.name}
            </h4>
            <p className="text-[#1C1410] font-semibold text-xs mt-0.5">
              {reel.product.price} MAD
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