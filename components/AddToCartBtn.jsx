'use client';
import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useLangStore } from '../store/useLangStore'; // 🌟 Translation Engine Import Kiya

export default function AddToCartBtn({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart); 

  // 🌟 Engine hook
  const t = useLangStore((state) => state.t);

  const isOutOfStock = product.inStock === false;

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Simulating a tiny network delay for the premium feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image 
    });

    setIsAdding(false);
    
    // Item add hote hi drawer open kardo
    if (openCart) {
      openCart();
    }
  };

  if (isOutOfStock) {
    return (
      <button
        disabled
        className="w-full py-4.5 rounded-full bg-[#E8D9C5] text-[#7A4B3A]/60 font-semibold uppercase tracking-[0.2em] text-sm cursor-not-allowed"
      >
        {t('outOfStock')} {/* 🌟 Hardcoded hata diya */}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`group w-full py-4.5 rounded-full font-semibold uppercase tracking-[0.2em] text-sm transition-colors duration-300 shadow-lg flex items-center justify-center gap-3
        ${isAdding
          ? 'bg-[#7A4B3A] text-[#FBF6F0] cursor-wait'
          : 'bg-[#1C1410] text-[#FBF6F0] hover:bg-[#B5704A] active:scale-[0.98]'
        }`}
    >
      {isAdding ? (
        <span className="flex items-center justify-center gap-2.5">
          <svg className="animate-spin h-4 w-4 text-[#FBF6F0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          {t('adding')} {/* 🌟 Loading text yahan se aayega */}
        </span>
      ) : (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A574] group-hover:bg-[#FBF6F0] transition-colors" />
          {t('addToCart')} {/* 🌟 Normal text yahan se aayega */}
        </>
      )}
    </button>
  );
}