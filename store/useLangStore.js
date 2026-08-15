// store/useLangStore.js
import { create } from 'zustand';
import { translations } from '../utils/translations';

export const useLangStore = create((set, get) => ({
  lang: 'FR', // Default language
  setLang: (newLang) => set({ lang: newLang }),
  
  // Ye 't' function humein translation nikal ke dega
  t: (key) => {
    const currentLang = get().lang;
    return translations[currentLang][key] || key;
  }
}));