import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface IFeedState {
  orders: TOrder[];
  total: number | null;
  totalToday: number | null;
  error: string | null;
}

const initialState: IFeedState = {
  orders: [],
  total: null,
  totalToday: null,
  error: null
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () =>
  getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedState: (state) => state,
    getFeedOrders: (state) => state.orders,
    getErrorFeed: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.orders = [];
        state.total = null;
        state.totalToday = null;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.error = 'Ошибка в получении ленты заказов';
      });
  }
});

export const feedReducer = feedSlice.reducer;
export const { getFeedState, getFeedOrders, getErrorFeed } =
  feedSlice.selectors;
export const feedSliceName = feedSlice.name;
