'use client';
import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import Link from 'next/link';
import { client } from '../lib/client'; // Yahan apna sanity client import kar

export default function SearchDrawer({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      // GROQ query: Name ya Tag match kare
      const groqQuery = `*[_type == "product" && (name match "${query}*" || tags match "${query}*")][0...5]`;
      const products = await client.fetch(groqQuery);
      setResults(products);
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500); // 500ms ka wait karega taaki baar-baar API hit na ho

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

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

        {/* Results Display */}
        <div className="mt-12 space-y-4">
          {loading && <p className="text-[#1C1410]/40">Chargement...</p>}
          {!loading && results.length > 0 && results.map((product) => (
            <Link 
              href={`/product/${product.slug.current}`} 
              key={product._id} 
              onClick={onClose}
              className="flex items-center gap-4 p-4 hover:bg-white/50 rounded-xl transition-colors"
            >
              <div className="text-lg font-medium text-[#1C1410]">{product.name}</div>
            </Link>
          ))}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="text-[#1C1410]/40">Aucun produit trouvé pour "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
}