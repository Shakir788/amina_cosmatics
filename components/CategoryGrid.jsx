'use client';
import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function CategoryGrid({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [activeSort, setActiveSort] = useState('featured');
  const [isPending, startTransition] = useTransition(); // React 18 Concurrency for non-blocking UI

  const handleSort = (sortType) => {
    setActiveSort(sortType);
    
    // useTransition se execution thread block nahi hoga aur fluid animations milengi
    startTransition(() => {
      let sorted = [...products];
      if (sortType === 'price-asc') {
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortType === 'price-desc') {
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
      } else {
        sorted = [...initialProducts]; // Featured/Default
      }
      setProducts(sorted);
    });
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed border-[#E8D9C5] rounded-[32px] bg-white/40 backdrop-blur-sm">
        <p className="text-[#1C1410]/50 font-medium uppercase tracking-widest text-sm">
          Aucun produit disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Upper Premium Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#E8D9C5]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1C1410]/70">
          <SlidersHorizontal className="w-4 h-4 text-[#B5704A]" />
          <span>Filtres</span>
        </div>

        {/* Luxury Sorting Menu Dropdown/Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto overflow-x-auto no-scrollbar">
          <span className="text-[11px] uppercase tracking-wider text-[#1C1410]/40 font-medium shrink-0 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Trier par :
          </span>
          {[
            { id: 'featured', label: 'Sélection' },
            { id: 'price-asc', label: 'Prix : Bas à Élevé' },
            { id: 'price-desc', label: 'Prix : Élevé à Bas' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleSort(option.id)}
              className={`text-xs uppercase tracking-widest font-semibold px-4 py-2 rounded-full transition-all duration-300 shrink-0 whitespace-nowrap border ${
                activeSort === option.id
                  ? 'bg-[#1C1410] text-[#FBF6F0] border-[#1C1410] shadow-sm'
                  : 'bg-white/60 text-[#1C1410]/70 border-[#E8D9C5] hover:border-[#B5704A]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Cards Grid Wrapper with Fluid Layout Animation */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full flex"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}