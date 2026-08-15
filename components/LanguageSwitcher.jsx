'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLangStore } from '../store/useLangStore'; // 🌟 Store import kiya

const LANGUAGES = [
  { code: 'FR', name: 'Français' },
  { code: 'AR', name: 'العربية' },
  { code: 'EN', name: 'English' }
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 🌟 Naya connection
  const activeLangCode = useLangStore((state) => state.lang);
  const setLang = useLangStore((state) => state.setLang);

  const activeLang = LANGUAGES.find(l => l.code === activeLangCode) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-1.5 text-[#1C1410] hover:text-[#B5704A] transition-colors py-2 px-1"
      >
        <Globe className="w-4 h-4 text-[#1C1410]/50 group-hover:text-[#B5704A] transition-colors" />
        <span className="text-[11px] font-bold uppercase tracking-widest mt-0.5">
          {activeLang.code}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#1C1410]/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-36 bg-white/95 backdrop-blur-xl border border-[#E8D9C5] rounded-[1.25rem] shadow-[0_20px_40px_-10px_rgba(28,20,16,0.15)] overflow-hidden"
          >
            <div className="py-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLang(lang.code); // 🌟 Global language change
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 text-[13px] transition-colors flex items-center justify-between
                    ${activeLang.code === lang.code 
                      ? 'bg-[#FBF6F0] text-[#B5704A] font-bold' 
                      : 'text-[#1C1410]/70 hover:bg-[#FBF6F0]/50 hover:text-[#1C1410]'
                    }`}
                >
                  {lang.name}
                  {activeLang.code === lang.code && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B5704A] shadow-[0_0_8px_rgba(181,112,74,0.6)]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}