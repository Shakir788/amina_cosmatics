import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      isOpen: false,
      cart: [],

      // Cart toggle functions
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Add item (or increase quantity)
      addToCart: (product) => set((state) => {
        const existingIndex = state.cart.findIndex((item) => item.id === product.id);
        
        if (existingIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingIndex].quantity += 1;
          return { cart: newCart, isOpen: true };
        }
        
        return { 
          cart: [...state.cart, { ...product, quantity: 1 }], 
          isOpen: true 
        };
      }),

      // Quantity update logic
      updateQuantity: (id, delta) => set((state) => ({
        cart: state.cart.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
          return item;
        })
      })),

      // Remove item
      removeFromCart: (id) => set((state) => ({ 
        cart: state.cart.filter((item) => item.id !== id) 
      })),
    }),
    {
      name: 'amina-cart-storage', // Ye name localStorage mein dikhega
    }
  )
);