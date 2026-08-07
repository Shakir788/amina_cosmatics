'use client';
import { motion } from 'framer-motion';

function OrangeBlossomMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="#B5704A" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6.5"
          rx="2"
          ry="3.4"
          fill="none"
          stroke="#B5704A"
          strokeWidth="1"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

export default function HeroSection() {
  return (
    <div className="relative min-h-[100svh] lg:min-h-[88vh] overflow-hidden bg-[#FBF6F0]">
      {/* ambient corner glow, subtle */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-[#D4A574]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-[#B5704A]/10 blur-3xl" />

      <div className="relative min-h-[100svh] lg:min-h-[88vh] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-16 px-5 sm:px-6 md:px-12 max-w-[1400px] mx-auto w-full pt-28 pb-14 lg:py-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 space-y-6 sm:space-y-9 text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#E8D9C5] bg-white/70 backdrop-blur-md">
            <OrangeBlossomMark />
            <span className="text-[9px] sm:text-[10px] font-semibold text-[#B5704A] uppercase tracking-[0.25em]">
              Nouvelle Collection 2026
            </span>
          </div>

          <h1 className="text-[#1C1410]">
            <span
              className="block text-[2.75rem] leading-[1] sm:text-6xl md:text-7xl sm:leading-[0.95] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              Beauté premium.
            </span>
            <span className="block text-lg sm:text-2xl md:text-3xl font-medium text-[#7A4B3A]/80 tracking-wide mt-3 sm:mt-4">
              Livraison partout au Maroc.
            </span>
          </h1>

          <div className="flex items-center gap-3 max-w-md w-full">
            <span className="h-px flex-1 bg-gradient-to-r from-[#D4A574] to-transparent" />
            <OrangeBlossomMark />
            <span className="h-px flex-1 bg-gradient-to-l from-[#D4A574] to-transparent" />
          </div>

          <p className="text-base sm:text-lg text-[#1C1410]/60 max-w-md leading-relaxed">
            Découvrez notre sélection des meilleures marques de cosmétiques mondiales, choisies spécialement pour votre éclat.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group w-full sm:w-auto bg-[#1C1410] text-[#FBF6F0] px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#1C1410]/15 transition-colors duration-300 hover:bg-[#B5704A] flex items-center justify-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574] group-hover:bg-[#FBF6F0] transition-colors" />
              Découvrir
            </motion.button>

            <span className="text-xs uppercase tracking-[0.2em] text-[#7A4B3A]/60 font-medium">
              Livraison 24/48h
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 w-full max-w-[260px] sm:max-w-sm relative flex justify-center lg:justify-end mt-2 lg:mt-0"
        >
          <div className="relative w-full max-w-[220px] sm:max-w-[320px] aspect-[9/16] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(28,20,16,0.35)] ring-1 ring-[#E8D9C5]">
            <video
              src="https://www.pexels.com/download/video/7614789/"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/30 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-6 bg-white/90 backdrop-blur-md rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg border border-[#E8D9C5] flex items-center gap-2">
            <OrangeBlossomMark />
            <span className="text-[11px] sm:text-xs font-semibold text-[#1C1410] tracking-wide whitespace-nowrap">
              100% Authentique
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}