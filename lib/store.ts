import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  bundleSavings: () => number;
  bundleCount: () => number;
  total: () => number;
  itemCount: () => number;
}

const BUNDLE_SIZE = 2;
const BUNDLE_PRICE = 80;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, { product, quantity: 1 }] }));
        }
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      subtotal: () =>
        round2(
          get().items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          )
        ),
      bundleCount: () => {
        const unitCount = get().itemCount();
        return Math.floor(unitCount / BUNDLE_SIZE);
      },
      bundleSavings: () => {
        const units = get()
          .items.flatMap((i) => Array(i.quantity).fill(i.product.price))
          .sort((a, b) => b - a);
        const bundles = Math.floor(units.length / BUNDLE_SIZE);
        let savings = 0;
        for (let b = 0; b < bundles; b++) {
          const pair = units.slice(b * BUNDLE_SIZE, b * BUNDLE_SIZE + BUNDLE_SIZE);
          const pairSum = pair.reduce((s, v) => s + v, 0);
          if (pairSum > BUNDLE_PRICE) savings += pairSum - BUNDLE_PRICE;
        }
        return round2(savings);
      },
      total: () => round2(get().subtotal() - get().bundleSavings()),
      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "royve-cart" }
  )
);
