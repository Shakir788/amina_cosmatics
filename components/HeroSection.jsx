'use client';
import { motion } from 'framer-motion';
import { Sparkles, ClipboardList, ArrowRight, Gift } from 'lucide-react'; 
import { useQuizStore } from '../store/useQuizStore'; 
import { useLangStore } from '../store/useLangStore'; // 🌟 Naya Translation Engine Import Kiya

function OrangeBlossomMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="1.6" fill="#B5704A" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="12" cy="6.5" rx="2" ry="3.4" fill="none" stroke="#B5704A" strokeWidth="1" transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
}

export default function HeroSection() {
  const openAIDiagnostic = () => {
    window.dispatchEvent(new Event('open-amina-ai'));
  };

  const openQuiz = useQuizStore((state) => state.openQuiz);

  // 🌟 Translation Engine ke Hooks
  const t = useLangStore((state) => state.t);
  const lang = useLangStore((state) => state.lang);
  const isArabic = lang === 'AR'; // Arabic check for RTL layout

  return (
    <div className="relative min-h-[100svh] lg:min-h-[88vh] overflow-hidden bg-[#FBF6F0]">
      {/* ambient corner glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-[#D4A574]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-[#B5704A]/10 blur-3xl" />

      {/* 🌟 Yahan RTL layout set kiya hai Arabic ke liye */}
      <div dir={isArabic ? 'rtl' : 'ltr'} className="relative min-h-[100svh] lg:min-h-[88vh] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-16 px-5 sm:px-6 md:px-12 max-w-[1400px] mx-auto w-full pt-28 pb-14 lg:py-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`flex-1 space-y-6 sm:space-y-8 flex flex-col ${isArabic ? 'text-center lg:text-right items-center lg:items-end' : 'text-center lg:text-left items-center lg:items-start'}`}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#E8D9C5] bg-white/70 backdrop-blur-md shadow-sm">
            <OrangeBlossomMark />
            <span className="text-[9px] sm:text-[10px] font-bold text-[#B5704A] uppercase tracking-[0.25em]">
              {t('heroTag')}
            </span>
          </div>

          <h1 className="text-[#1C1410]">
            <span
              className="block text-[2.75rem] leading-[1] sm:text-6xl md:text-7xl sm:leading-[0.95] tracking-tight"
              style={{ fontFamily: isArabic ? 'system-ui, sans-serif' : "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              {t('heroTitle1')}
            </span>
            <span className="block text-lg sm:text-2xl md:text-3xl font-medium text-[#7A4B3A]/80 tracking-wide mt-3 sm:mt-4">
              {t('heroTitle2')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#1C1410]/60 max-w-md leading-relaxed">
            {t('heroDesc')}
          </p>

          <div className="w-full max-w-xl flex flex-col sm:flex-row gap-4 mt-2 mb-2">
            
            {/* 1. AI Diagnostic Widget */}
            <motion.button
              onClick={openAIDiagnostic}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group flex-1 relative rounded-[1.5rem] p-[2px] overflow-hidden text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B5704A] via-[#E8D9C5] to-[#D4A574] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`relative h-full bg-white/95 backdrop-blur-xl rounded-[1.4rem] p-5 flex flex-col gap-3 shadow-[0_8px_30px_rgba(181,112,74,0.15)] group-hover:shadow-[0_15px_40px_rgba(181,112,74,0.25)] transition-all ${isArabic ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FBF6F0] to-[#E8D9C5] flex items-center justify-center shrink-0 border border-[#D4A574]/30 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-5 h-5 text-[#B5704A]" />
                  </div>
                  <span className="inline-flex items-center gap-1 bg-[#B5704A] text-white px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm animate-pulse">
                    <Gift className="w-3 h-3 text-[#FBF6F0]" />
                    {t('btnFree')}
                  </span>
                </div>
                <div>
                  <h3 className="text-[#1C1410] font-bold text-[15px] tracking-tight flex items-center gap-1.5">
                    {t('btnDiagnostic')}
                  </h3>
                  <p className="text-[#B5704A] text-xs font-semibold mt-0.5">
                    Analyse offerte en 30s ⚡
                  </p>
                </div>
              </div>
            </motion.button>

            {/* 2. Skin Quiz Widget */}
            <motion.button
              onClick={openQuiz}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group flex-1 relative rounded-[1.5rem] p-[2px] overflow-hidden text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C1410] via-[#D4A574]/60 to-[#1C1410] opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`relative h-full bg-[#1C1410] rounded-[1.4rem] p-5 flex flex-col gap-3 shadow-[0_8px_30px_rgba(28,20,16,0.2)] group-hover:shadow-[0_15px_40px_rgba(28,20,16,0.35)] transition-all ${isArabic ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-full bg-[#2A1E18] flex items-center justify-center shrink-0 border border-[#D4A574]/20 group-hover:border-[#D4A574] group-hover:bg-[#B5704A]/20 transition-colors duration-300">
                    <ClipboardList className="w-5 h-5 text-[#D4A574]" />
                  </div>
                  <span className="inline-flex items-center gap-1 bg-[#D4A574]/20 border border-[#D4A574]/40 text-[#D4A574] px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                    Gratuit
                  </span>
                </div>
                <div>
                  <h3 className="text-[#FBF6F0] font-bold text-[15px] tracking-tight flex items-center justify-between">
                    {t('btnQuiz')}
                    <ArrowRight className={`w-4 h-4 text-[#D4A574] transition-transform ${isArabic ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                  </h3>
                  <p className="text-[#D4A574] text-xs font-semibold mt-0.5">
                    Routine sur-mesure offerte ✨
                  </p>
                </div>
              </div>
            </motion.button>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group bg-[#1C1410] text-[#FBF6F0] px-8 sm:px-10 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#1C1410]/15 transition-colors duration-300 hover:bg-[#B5704A] flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574] group-hover:bg-[#FBF6F0] transition-colors" />
              {t('btnCatalog')}
            </motion.button>
          </div>
        </motion.div>

        {/* Cinematic Vertical Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden lg:flex flex-1 w-full max-w-sm relative justify-end"
        >
          <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(28,20,16,0.35)] ring-1 ring-[#E8D9C5]">
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

          <div className="absolute -bottom-5 -left-6 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-[#E8D9C5] flex items-center gap-2">
            <OrangeBlossomMark />
            <span className="text-xs font-semibold text-[#1C1410] tracking-wide whitespace-nowrap">
              100% Authentique
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}