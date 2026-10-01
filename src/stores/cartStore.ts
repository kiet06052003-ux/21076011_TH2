import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '../constants/student';
import { Product } from '../services/productApi';

export interface CartItem {
  id: number;
  title: string;
  originalPrice: number;
  unitPrice: number; // Math.round(price * PRICE_MULTIPLIER)
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  changeQty: (id: number, qty: number) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const computedUnitPrice = Math.round(product.price * PRICE_MULTIPLIER);
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === product.id);
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated };
          } else {
            const newItem: CartItem = {
              id: product.id,
              title: product.title,
              originalPrice: product.price,
              unitPrice: computedUnitPrice,
              quantity: 1,
              image: product.image,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (id: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      changeQty: (id: number, qty: number) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
