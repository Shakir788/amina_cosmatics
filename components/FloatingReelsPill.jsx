'use client';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FloatingReelsPill() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      className="fixed bottom-6 left-6 md:left-8 z-[100]" 
    >
      <Link href="/reels" className="group relative block w-14 h-14">
        {/* Glow Ring Effect */}
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#B5704A] via-[#D4A574] to-[#B5704A] opacity-70 blur-md group-hover:opacity-100 transition-all duration-500 animate-pulse" />

        {/* Circular Button (Same for Mobile & Desktop) */}
        <div className="relative w-full h-full bg-[#1C1410] border border-[#D4A574]/40 shadow-[0_10px_30px_rgba(28,20,16,0.5)] backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-105 transition-all duration-300">
          
          {/* Play Icon (ml-0.5 is for optical centering of the triangle) */}
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          
          {/* Live Pulse Dot - Top Right */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B5704A] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#B5704A]" />
          </span>

        </div>
      </Link>
    </motion.div>
  );
}