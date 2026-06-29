import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  
  addToCart: (product, qty) => {
    const item = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    };
    
    set((state) => {
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        return {
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return { cartItems: [...state.cartItems, item] };
      }
    });
  },

  removeFromCart: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((x) => x.product !== id),
    }));
  },
  
  clearCart: () => {
    set({ cartItems: [] });
  }
}));
