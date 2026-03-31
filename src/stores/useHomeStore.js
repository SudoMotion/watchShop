import { create } from 'zustand';

const useHomeStore = create((set) => ({
  twoBanners: [],
  setTwoBanners: (items) => set({ twoBanners: Array.isArray(items) ? items : [] }),
}));

export default useHomeStore;
