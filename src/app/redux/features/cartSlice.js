import { createSlice } from "@reduxjs/toolkit";

// ✅ Get cart from localStorage
const getCart = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : {};
  }
  return {};
};

// ✅ Save cart to localStorage
const saveCart = (cart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

const initialState = {
  carts: getCart()
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // ➕ Add item
    addToCart: (state, action) => {
      const { userId, item } = action.payload;

      if (!state.carts[userId]) {
        state.carts[userId] = [];
      }

      const exist = state.carts[userId].find(
        (i) => i.mnuid === item.mnuid
      );

      if (exist) {
        exist.qty += 1;
      } else {
        state.carts[userId].push({
          ...item,
          qty: 1
        });
      }

      saveCart(state.carts);
    },

    // ➕ Increase qty
    increaseQty: (state, action) => {
      const { userId, id } = action.payload;

      const item = state.carts[userId]?.find(
        (i) => i.mnuid === id
      );

      if (item) item.qty += 1;

      saveCart(state.carts);
    },

    // ➖ Decrease qty
    decreaseQty: (state, action) => {
      const { userId, id } = action.payload;

      const item = state.carts[userId]?.find(
        (i) => i.mnuid === id
      );

      if (!item) return;

      item.qty -= 1;

      // ❗ Auto remove if qty = 0
      if (item.qty <= 0) {
        state.carts[userId] = state.carts[userId].filter(
          (i) => i.mnuid !== id
        );
      }

      saveCart(state.carts);
    },

    // ❌ Remove item directly
    removeFromCart: (state, action) => {
      const { userId, id } = action.payload;

      const cart = state.carts[userId] || [];

      state.carts[userId] = cart.filter(
        (item) => item.mnuid !== id
      );

      saveCart(state.carts);
    },

    // 🧹 Clear full cart
    clearCart: (state, action) => {
      const userId = action.payload;

      state.carts[userId] = [];

      saveCart(state.carts);
    }

  }
});

// ✅ EXPORTS
export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;