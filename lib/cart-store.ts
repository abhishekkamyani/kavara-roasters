"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  origin: string;
  imageUrl: string;
  /** Tier price per kg shown when the item was added; the server re-prices at checkout. */
  unitPrice: number;
  /** Kilograms. */
  quantity: number;
  /** Smallest quantity this product can be ordered in. */
  moqKg: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  add: (item: CartItem) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      setOpen: (isOpen) => set({ isOpen }),
      add: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId
          );
          if (!existing) return { items: [...state.items, item] };
          return {
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...item, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(i.moqKg, Math.floor(quantity)) }
              : i
          ),
        })),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "kavara-cart",
      partialize: (state) => ({ items: state.items }),
      // Rehydrated from an effect in CartDrawer so server and client markup match.
      skipHydration: true,
    }
  )
);

export function cartTotalKg(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}
