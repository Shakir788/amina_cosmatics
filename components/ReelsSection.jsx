'use client';
import { motion } from 'framer-motion';

// Tune jitni 8 links di thi, sab yahan list mein daal di hain
const onlineVideos = [
  "https://www.pexels.com/download/video/7614789/",
  "https://www.pexels.com/download/video/7428167/",
  "https://www.pexels.com/download/video/7316967/",
  "https://www.pexels.com/download/video/5937378/",
  "https://www.pexels.com/download/video/7428171/",
  "https://www.pexels.com/download/video/7852689/",
  "https://www.pexels.com/download/video/8479189/",
  "https://www.pexels.com/download/video/8479090/"
];

export default function ReelsSection() {
  return (
    <section className="py-24">
      <h2 className="text-3xl font-bold text-cosmo-dark mb-12 tracking-tight">Découvrir en Vidéo</h2>
      
      {/* Horizontal scrollable container */}
      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
        {onlineVideos.map((src, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="cinematic-reel min-w-[240px] relative border border-cosmo-glassborder bg-cosmo-secondary overflow-hidden shadow-lg h-[400px] shrink-0"
          >
            {/* 9:16 Aspect Ratio Enforced in Video */}
            <video 
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Dark gradient overlay for a premium SaaS look */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}