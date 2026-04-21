import { createSlice } from "@reduxjs/toolkit";

const getCart = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : {};
  }
  return {};
};

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
    addToCart: (state, action) => {
      const { userId, item } = action.payload;
      if (!state.carts[userId]) {
        state.carts[userId] = [];
      }
      const cartKey = item.cartKey || item.mnuid;
      const exist = state.carts[userId].find(
        (i) => (i.cartKey || i.mnuid) === cartKey
      );
      if (exist) {
        exist.qty += 1;
      } else {
        state.carts[userId].push({ ...item, qty: 1 });
      }
      saveCart(state.carts);
    },

    increaseQty: (state, action) => {
      const { userId, id } = action.payload;
      const item = state.carts[userId]?.find(
        (i) => (i.cartKey || i.mnuid) === id
      );
      if (item) item.qty += 1;
      saveCart(state.carts);
    },

    decreaseQty: (state, action) => {
      const { userId, id } = action.payload;
      const item = state.carts[userId]?.find(
        (i) => (i.cartKey || i.mnuid) === id
      );
      if (!item) return;
      item.qty -= 1;
      if (item.qty <= 0) {
        state.carts[userId] = state.carts[userId].filter(
          (i) => (i.cartKey || i.mnuid) !== id
        );
      }
      saveCart(state.carts);
    },

    removeFromCart: (state, action) => {
      const { userId, id } = action.payload;
      const cart = state.carts[userId] || [];
      state.carts[userId] = cart.filter(
        (item) => (item.cartKey || item.mnuid) !== id
      );
      saveCart(state.carts);
    },

    clearCart: (state, action) => {
      const userId = action.payload;
      state.carts[userId] = [];
      saveCart(state.carts);
    }
  }
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;