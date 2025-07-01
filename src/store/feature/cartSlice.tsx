import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product, CartState } from "../../types/types";

interface CartItem extends Product {
  quantity: number;
}

const initialState: CartState = {
  userId: null,
  items: [],
};

const saveCartToStorage = (userId: string | null, items: CartItem[]) => {
  if (!userId) return;
  localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
};

export const getInitialCartState = (userId: string | null): CartState => {
  if (!userId) return { userId, items: [] };

  const saved = localStorage.getItem(`cart_${userId}`);

  return {
    userId: userId,
    items: saved ? JSON.parse(saved) : [],
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (
      state,
      action: PayloadAction<{ userId: string | null; product: Product }>
    ) => {
      const { userId, product } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCartToStorage(userId, JSON.parse(JSON.stringify(state.items)));
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ userId: string | null; productId: string }>
    ) => {
      const { userId, productId } = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveCartToStorage(userId, JSON.parse(JSON.stringify(state.items)));
    },
    clearCart: (state, action: PayloadAction<{ userId: string | null }>) => {
      state.items = [];
      if (action.payload?.userId) {
        saveCartToStorage(
          action.payload.userId,
          JSON.parse(JSON.stringify(state.items))
        );
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        userId: string | null;
        id: string;
        quantity: number;
      }>
    ) => {
      const { userId, id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        saveCartToStorage(userId, JSON.parse(JSON.stringify(state.items)));
      }
    },
    increaseQuantity: (
      state,
      action: PayloadAction<{ userId: string | null; id: string }>
    ) => {
      const { userId, id } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity += 1;
        saveCartToStorage(userId, JSON.parse(JSON.stringify(state.items)));
      }
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<{ userId: string | null; id: string }>
    ) => {
      const { userId, id } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        state.items = state.items.filter((i) => i.id !== id);
      }
      saveCartToStorage(userId, JSON.parse(JSON.stringify(state.items)));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  setCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
