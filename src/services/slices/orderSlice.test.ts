import {
  orderDetailReducer as reducer,
  clearOrderState,
  fetchCreateOrder,
  fetchDetailOrder
} from './orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const initialState = {
    order: null as TOrder | null,
    orderRequest: false,
    errorDetailOrder: null as string | null,
    errorCreateOrder: null as string | null
  };

  const mockOrder: TOrder = {
    _id: '1',
    status: 'готов',
    name: 'Бургер',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 123,
    ingredients: ['Булка', 'Начинка']
  };

  it('должен обрабатывать начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('очистка состояния заказа', () => {
    it('должен очищать заказ при clearOrderState', () => {
      const state = {
        ...initialState,
        order: mockOrder
      };
      const action = clearOrderState();
      const newState = reducer(state, action);
      expect(newState.order).toBe(null);
    });
  });

  describe('получение деталей заказа', () => {
    it('должен обрабатывать состояние pending для fetchDetailOrder', () => {
      const action = { type: fetchDetailOrder.pending.type };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
      expect(state.errorDetailOrder).toBe(null);
    });

    it('должен обрабатывать состояние fulfilled для fetchDetailOrder', () => {
      const action = {
        type: fetchDetailOrder.fulfilled.type,
        payload: { orders: [mockOrder] }
      };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);
    });

    it('должен обрабатывать состояние rejected для fetchDetailOrder', () => {
      const action = {
        type: fetchDetailOrder.rejected.type,
        error: { message: 'Ошибка в получении данных заказа' }
      };
      const state = reducer({ ...initialState, orderRequest: true }, action);
      expect(state.orderRequest).toBe(false);
      expect(state.errorDetailOrder).toBe('Ошибка в получении данных заказа');
    });
  });

  describe('создание заказа', () => {
    it('должен обрабатывать состояние pending для fetchCreateOrder', () => {
      const action = { type: fetchCreateOrder.pending.type };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
      expect(state.errorCreateOrder).toBe(null);
    });

    it('должен обрабатывать состояние fulfilled для fetchCreateOrder', () => {
      const action = {
        type: fetchCreateOrder.fulfilled.type,
        payload: { order: mockOrder }
      };
      const state = reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);
    });

    it('должен обрабатывать состояние rejected для fetchCreateOrder', () => {
      const action = {
        type: fetchCreateOrder.rejected.type,
        error: { message: 'Ошибка в создании заказа' }
      };
      const state = reducer({ ...initialState, orderRequest: true }, action);
      expect(state.orderRequest).toBe(false);
      expect(state.errorCreateOrder).toBe('Ошибка в создании заказа');
    });
  });
});
