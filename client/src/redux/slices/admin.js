import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  error: null,
  userList: null,
  orders: null,
  userRemoval: false,
  orderRemoval: false,
  deliveredFlag: true,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },

    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },

    getUsers: (state, { payload }) => {
      state.userList = payload;
      state.error = null;
      state.loading = false;
    },

    userDelete: (state) => {
      state.error = null;
      state.loading = false;
      state.userRemoval = true;
    },

    getOrders: (state, { payload }) => {
      state.orders = payload;
      state.error = null;
      state.loading = false;
    },

    orderDelete: (state) => {
      state.error = null;
      state.loading = false;
      state.orderRemoval = true;
    },

    setDeliveredFlag: (state) => {
      state.deliveredFlag = true;
      state.loading = false;
    },

    resetError: (state) => {
      state.error = null;
      state.loading = false;
      state.userRemoval = false;
      state.deliveredFlag = false;
      state.orderRemoval = false;
    },
  },
});

export const { setLoading, setError, resetError, getUsers, userDelete, getOrders, setDeliveredFlag, orderDelete } =
  adminSlice.actions;
export default adminSlice.reducer;

export const adminSelector = (state) => state.admin;
