import { create } from 'zustand';
import api from '../services/api';

export const useAdminStore = create((set, get) => ({
  products: [],
  orders: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/products');
      set({ products: data, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  createProduct: async (payload) => {
    const { data } = await api.post('/products', payload);
    set((s) => ({ products: [data, ...s.products] }));
    return data;
  },

  updateProduct: async (id, payload) => {
    const { data } = await api.put(`/products/${id}`, payload);
    set((s) => ({ products: s.products.map((p) => (p._id === id ? data : p)) }));
    return data;
  },

  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
    set((s) => ({ products: s.products.filter((p) => p._id !== id) }));
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/orders');
      set({ orders: data, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  markDelivered: async (id) => {
    const { data } = await api.put(`/orders/${id}/deliver`);
    set((s) => ({ orders: s.orders.map((o) => (o._id === id ? data : o)) }));
  },
}));
