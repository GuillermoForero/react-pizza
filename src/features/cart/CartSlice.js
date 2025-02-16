import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      if (item) {
        item.quantity += 1;
        item.totalPrice = item.unitPrice * item.quantity;
      }
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice = item.unitPrice * item.quantity;
      } else {
        state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
      }
    },
    clearCart(state) {
      state.cart = [];
    },
  },
  selectors: {
    selectTotalQuantity: (state) =>
      state.cart.reduce((sum, item) => sum + item.quantity, 0),
    selectTotalPrice: (state) =>
      state.cart.reduce((sum, item) => sum + item.totalPrice, 0),
    getCart: (state) => state.cart,
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export const { selectTotalQuantity, selectTotalPrice, getCart, getItemById } =
  cartSlice.selectors;

export const getCurrentQuantity = (id) => (state) => {
  return state.cart.cart.find((item) => item.pizzaId === id)?.quantity || 0;
};

export default cartSlice.reducer;
