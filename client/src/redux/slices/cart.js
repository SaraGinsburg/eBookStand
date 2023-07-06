import { createSlice } from '@reduxjs/toolkit';

const calculateSubtotal = (stateCart) => {
  let result = 0;
  stateCart.map((item) => (result += item.qty * item.price));

  return Number(result).toFixed(2);
};

const updateLocalStorage = (cart) => {
  localStorage.setItem('cartItems', JSON.stringify(cart));
  localStorage.setItem('subtotal', JSON.stringify(calculateSubtotal(cart)));
};

export const initialState = {
  loading: false,
  error: null,
  cart: JSON.parse(localStorage.getItem('cartItems')) ?? [],
  expressShipping: JSON.parse(localStorage.getItem('expressShipping')) ?? false,
  subtotal: JSON.parse(localStorage.getItem('subtotal')) ?? 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    cartItemAdd: (state, { payload }) => {
      const existingItem = state.cart.find((item) => item.id === payload.id);

      if (existingItem) {
        state.cart = state.cart.map((item) => (item.id === existingItem.id ? payload : item));
      } else {
        state.cart = [...state.cart, payload];
      }
      state.loading = false;
      state.error = null;
      state.subtotal = calculateSubtotal(state.cart);
      updateLocalStorage(state.cart);
    },
    cartItemRemoval: (state, { payload }) => {
      state.cart = [...state.cart].filter((item) => item.id !== payload);
      state.subtotal = calculateSubtotal(state.cart);
      updateLocalStorage(state.cart);
      state.loading = false;
      state.error = null;
    },
    setExpressShipping: (state, { payload }) => {
      state.expressShipping = payload;
      localStorage.setItem('expressShipping', payload);
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem('cartItems');
    },
  },

  setError: (state, { payload }) => {
    state.error = payload;
    state.loading = false;
  },
});

export const { setLoading, cartItemAdd, setError, cartItemRemoval, setExpressShipping, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const cartSelector = (state) => state.cart;
