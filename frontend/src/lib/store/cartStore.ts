import { create } from 'zustand';
import { ordersApi } from '@/lib/api';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  loadCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  totalItems: 0,
  totalPrice: 0,

  loadCart: async () => {
    set({ isLoading: true });
    try {
      const data = await ordersApi.getCart();
      const items = data.items || [];
      set({
        items,
        totalItems: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0),
        totalPrice: items.reduce((sum: number, i: CartItem) => sum + i.price * i.quantity, 0),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity) => {
    await ordersApi.addToCart(productId, quantity);
    await get().loadCart();
  },

  removeItem: async (itemId) => {
    await ordersApi.removeFromCart(itemId);
    await get().loadCart();
  },

  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
}));
