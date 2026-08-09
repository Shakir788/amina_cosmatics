import { create } from 'zustand';

export const useQuizStore = create((set) => ({
  isOpen: false,
  openQuiz: () => set({ isOpen: true }),
  closeQuiz: () => set({ isOpen: false }),
}));