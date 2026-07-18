import { create } from 'zustand';
import api from '../services/api';

export const useWishlistStore = create((set) => ({
  wishlistItems: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/wishlist');
      set({ wishlistItems: data.products || [], loading: false });
    } catch (error) {
      console.error('Fetch wishlist error:', error);
      set({ loading: false });
    }
  },

  addToWishlist: async (productId) => {
    try {
      const { data } = await api.post('/wishlist', { productId });
      set({ wishlistItems: data.products || [] });
    } catch (error) {
      console.error('Add to wishlist error:', error);
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const { data } = await api.delete('/wishlist', { data: { productId } });
      set({ wishlistItems: data.products || [] });
    } catch (error) {
      console.error('Remove from wishlist error:', error);
    }
  },
}));
