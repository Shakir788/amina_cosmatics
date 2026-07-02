import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      
      toggleWishlist: (product) => {
        const currentWishlist = get().wishlist;
        // Check karte hain ki product pehle se wishlist mein hai ya nahi
        const exists = currentWishlist.find((item) => item._id === product._id);
        
        if (exists) {
          // Agar hai, toh remove kar do (un-heart)
          set({ wishlist: currentWishlist.filter((item) => item._id !== product._id) });
        } else {
          // Agar nahi hai, toh add kar do (heart)
          set({ wishlist: [...currentWishlist, product] });
        }
      },
      
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item._id === productId);
      },
    }),
    {
      name: 'amina-wishlist', // localStorage mein is naam se save hoga
    }
  )
);