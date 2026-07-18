import { create } from "zustand";
import api from "../services/api";

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    const { data } = await api.get("/cart");

    set({
      cart: data,
    });
  },

  addToCart: async (productId) => {
    const { data } = await api.post("/cart/add", {
      productId,
      quantity: 1,
    });

    set({
      cart: data,
    });
  },

  updateQuantity: async (productId, quantity) => {
    const { data } = await api.put("/cart/update", {
      productId,
      quantity,
    });

    set({
      cart: data,
    });
  },

  removeItem: async (productId) => {
    const { data } = await api.delete("/cart/remove", {
      data: {
        productId,
      },
    });

    set({
      cart: data,
    });
  },

  clearCart: () => {
    set((state) => ({
      cart: state.cart ? { ...state.cart, items: [] } : null,
    }));
  },
}));