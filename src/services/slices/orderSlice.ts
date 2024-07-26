import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const fetchDetailOrder = createAsyncThunk(
  'order/fetchDetailOrder',
  async (numberOrder: number, { dispatch }) => {
    dispatch(clearOrderState());
    return getOrderByNumberApi(numberOrder);
  }
);

export const fetchCreateOrder = createAsyncThunk(
  'order/fetchCreateOrder',
  async (data: string[], { dispatch }) => {
    dispatch(clearOrderState());
    const dataOrder = await orderBurgerApi(data);
    return dataOrder;
  }
);

interface IOrderDetailState {
  order: TOrder | null;
  orderRequest: boolean;
  errorDetailOrder: string | null;
  errorCreateOrder: string | null;
}

const initialState: IOrderDetailState = {
  order: null,
  orderRequest: false,
  errorDetailOrder: null,
  errorCreateOrder: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.order = null;
    }
  },
  selectors: {
    getOrder: (state) => state.order,
    getOrderRequest: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailOrder.pending, (state) => {
        state.errorDetailOrder = null;
        state.orderRequest = true;
      })
      .addCase(fetchDetailOrder.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.orderRequest = false;
      })
      .addCase(fetchDetailOrder.rejected, (state, action) => {
        state.errorDetailOrder = 'Ошибка в получении данных заказа';
        state.orderRequest = false;
      })
      .addCase(fetchCreateOrder.pending, (state) => {
        state.errorCreateOrder = null;
        state.orderRequest = true;
      })
      .addCase(fetchCreateOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(fetchCreateOrder.rejected, (state, action) => {
        state.errorCreateOrder = 'Ошибка в создании заказа';
        state.orderRequest = false;
      });
  }
});

export const { clearOrderState } = orderSlice.actions;
export const orderDetailReducer = orderSlice.reducer;
export const orderDetailName = orderSlice.name;
export const { getOrder, getOrderRequest } = orderSlice.selectors;
