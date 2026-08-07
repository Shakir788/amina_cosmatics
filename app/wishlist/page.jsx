'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore'; // Agar direct cart mein add karna ho

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Hydration error bachane ke liye
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen py-24 px-6 bg-[#FBF6F0] relative overflow-hidden">
      {/* Background blurs for luxury feel */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4A574]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#B5704A]/10 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-14 text-center">
          <p className="text-[#B5704A] uppercase tracking-[0.35em] text-[11px] font-semibold mb-3">
            Votre Sélection
          </p>
          <h1 className="text-5xl md:text-6xl tracking-tight text-[#1C1410] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
            Liste d'envies
          </h1>
          <p className="text-[#7A4B3A]/70 text-sm tracking-wide">
            {wishlist.length} {wishlist.length > 1 ? 'articles sauvegardés' : 'article sauvegardé'}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[32px] border border-[#E8D9C5] py-20 px-6 text-center shadow-sm max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FBF6F0] flex items-center justify-center mb-6 text-[#B5704A]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#1C1410] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Votre liste est vide
            </h2>
            <p className="text-[#7A4B3A]/70 mb-8 max-w-md text-sm">
              Découvrez nos collections et sauvegardez vos produits préférés pour les retrouver facilement plus tard.
            </p>
            <Link href="/" className="bg-[#1C1410] text-[#FBF6F0] px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-[#B5704A] transition-colors">
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-[#E8D9C5] hover:shadow-xl transition-all duration-500 relative flex flex-col">
                
                {/* Remove from Wishlist Button */}
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#1C1410] hover:text-red-500 hover:bg-white transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Product Image */}
                <Link href={`/product/${product.slug}`} className="relative h-72 w-full bg-[#FBF6F0] block overflow-hidden">
                  <Image 
                    src={product.image || '/amina-avatar.png'} // Fallback image if missing
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </Link>

                {/* Product Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg text-[#1C1410] mb-2 font-medium">{product.name}</h3>
                  <p className="text-[#B5704A] font-semibold mb-4 mt-auto">{product.price} MAD</p>
                  
                  {/* Add to cart directly from wishlist */}
                  <button 
                    onClick={() => {
                      addToCart({ ...product, quantity: 1 });
                    }}
                    className="w-full border border-[#1C1410] text-[#1C1410] py-2.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-semibold hover:bg-[#1C1410] hover:text-[#FBF6F0] transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}