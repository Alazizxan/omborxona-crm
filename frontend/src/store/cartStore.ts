import { create } from "zustand";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  currency: "UZS" | "USD";
  quantity: number;
}

interface CartState {
  items: CartItem[];

  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  increase: (productId: string) => void;
  decrease: (productId: string) => void;

  totalUZS: () => number;
  totalUSD: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],

  add: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.productId === item.productId
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return { items: [...state.items, item] };
    }),

  remove: (productId) =>
    set((state) => ({
      items: state.items.filter(
        (i) => i.productId !== productId
      ),
    })),

  increase: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    })),

  decrease: (productId) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0),
    })),

  totalUZS: () =>
    get().items
      .filter((i) => i.currency === "UZS")
      .reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      ),

  totalUSD: () =>
    get().items
      .filter((i) => i.currency === "USD")
      .reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      ),
}));
