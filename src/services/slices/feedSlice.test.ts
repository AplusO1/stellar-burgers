import {
  feedReducer,
  getFeedState,
  getFeedOrders,
  getErrorFeed,
  fetchFeed
} from './feedSlice';
import { TOrder } from '@utils-types';

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: null,
    totalToday: null,
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'готов',
      name: 'Бургер',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      number: 123,
      ingredients: ['Булка', 'Начинка']
    }
  ];

  const mockFeedState = {
    orders: mockOrders,
    total: 12,
    totalToday: 2,
    error: null
  };

  it('должен обрабатывать начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('получение ленты заказов', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: fetchFeed.pending.type };
      const state = feedReducer(initialState, action);
      expect(state.orders).toEqual([]);
      expect(state.total).toBeNull();
      expect(state.totalToday).toBeNull();
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const action = {
        type: fetchFeed.fulfilled.type,
        payload: mockFeedState
      };
      const state = feedReducer(initialState, action);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(12);
      expect(state.totalToday).toBe(2);
      expect(state.error).toBeNull();
    });

    it('должен обрабатывать состояние rejected', () => {
      const action = {
        type: fetchFeed.rejected.type,
        error: { message: 'Ошибка в получении ленты заказов' }
      };
      const state = feedReducer(initialState, action);
      expect(state.orders).toEqual([]);
      expect(state.total).toBeNull();
      expect(state.totalToday).toBeNull();
      expect(state.error).toBe('Ошибка в получении ленты заказов');
    });
  });

  describe('селекторы', () => {
    it('getFeedState должен возвращать текущее состояние фида', () => {
      const state = { feed: mockFeedState };
      expect(getFeedState(state)).toEqual(mockFeedState);
    });

    it('getFeedOrders должен возвращать заказы', () => {
      const state = { feed: mockFeedState };
      expect(getFeedOrders(state)).toEqual(mockOrders);
    });

    it('getErrorFeed должен возвращать ошибку', () => {
      const state = { feed: { ...mockFeedState, error: 'Ошибка' } };
      expect(getErrorFeed(state)).toBe('Ошибка');
    });
  });
});
