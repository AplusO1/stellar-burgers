import {
  ordersReducer,
  getUserOrders,
  getUserOrdersError
} from './userOrdersSlice';
import { fetchUserOrders } from './userOrdersSlice';
import { TOrder } from '@utils-types';

describe('userOrdersSlice', () => {
  const initialState = {
    orders: [] as TOrder[],
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'completed',
      name: 'Order 1',
      createdAt: '2023-08-01T00:00:00.000Z',
      updatedAt: '2023-08-02T00:00:00.000Z',
      number: 1,
      ingredients: []
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Order 2',
      createdAt: '2023-08-03T00:00:00.000Z',
      updatedAt: '2023-08-04T00:00:00.000Z',
      number: 2,
      ingredients: []
    }
  ];

  it('должен обрабатывать начальное состояние', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('получение заказов пользователя', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = ordersReducer(initialState, action);
      expect(state.orders).toEqual([]);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = ordersReducer(initialState, action);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать состояние rejected', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Ошибка в получении истории заказов' }
      };
      const state = ordersReducer(initialState, action);
      expect(state.orders).toEqual([]);
      expect(state.error).toBe('Ошибка в получении истории заказов');
    });
  });

  describe('селекторы', () => {
    it('getUserOrders должен возвращать заказы', () => {
      const state = { userOrders: { orders: mockOrders, error: null } };
      expect(getUserOrders(state)).toEqual(mockOrders);
    });

    it('getUserOrdersError должен возвращать ошибку', () => {
      const state = { userOrders: { orders: [], error: 'Ошибка' } };
      expect(getUserOrdersError(state)).toBe('Ошибка');
    });
  });
});
