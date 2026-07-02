'use client';
import { useState } from 'react';
import SkinQuiz from './SkinQuiz';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SkinQuizBanner() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="w-full relative bg-[#1C1410] rounded-[40px] overflow-hidden my-24 shadow-2xl border border-[#E8D9C5]/20 flex flex-col items-center text-center p-12 md:p-20">
      {/* Aesthetic Glow Effects */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-[#B5704A] rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-[#D4A574] rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <span className="text-[#D4A574] uppercase tracking-[0.4em] text-[10px] font-bold mb-5 block flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          Innovation Amina
        </span>
        
        <h2 
          className="text-4xl md:text-5xl text-[#FBF6F0] mb-6 tracking-tight" 
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Le Diagnostic Beauté
        </h2>
        
        <p className="text-[#FBF6F0]/70 text-sm md:text-base mb-10 leading-relaxed">
          Découvrez la routine parfaite pour votre peau en seulement 3 questions. Une expertise sur-mesure développée par nos spécialistes pour révéler votre éclat naturel.
        </p>
        
        <button
          onClick={() => setIsQuizOpen(true)}
          className="group flex items-center justify-center gap-3 bg-[#FBF6F0] text-[#1C1410] px-8 py-4.5 rounded-full font-semibold uppercase tracking-[0.15em] text-[11px] hover:bg-[#B5704A] hover:text-[#FBF6F0] transition-all duration-300 active:scale-95 shadow-[0_10px_30px_rgba(181,112,74,0.3)]"
        >
          Commencer le test
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* The Quiz Modal */}
      <SkinQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
}