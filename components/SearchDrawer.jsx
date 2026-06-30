'use client';
import { useState } from 'react';
import { X, Search } from 'lucide-react';
import Link from 'next/link';

export default function SearchDrawer({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-[#FBF6F0] p-6 md:p-12 transition-opacity">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Rechercher</h2>
          <button onClick={onClose} className="p-2 hover:text-[#B5704A] transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            autoFocus
            placeholder="Rechercher un produit..."
            className="w-full bg-transparent border-b border-[#1C1410]/20 pb-4 text-2xl md:text-4xl focus:outline-none focus:border-[#B5704A] transition-colors placeholder:text-[#1C1410]/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute right-0 top-2 w-6 h-6 text-[#1C1410]/40" />
        </div>

        {/* Yahan results dikhenge jab tu Sanity se query connect karega */}
        <div className="mt-12 text-center text-[#1C1410]/40">
          {query.length > 0 ? `Recherche pour "${query}"...` : "Commencez à taper pour chercher vos produits favoris."}
        </div>
      </div>
    </div>
  );
}