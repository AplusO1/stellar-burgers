import {
  burgerIngredientsReducer,
  fetchBurgerIngredients
} from './burgerIngredientsSlice';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    }
  ];

  it('должен обрабатывать начальное состояние', () => {
    expect(burgerIngredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('получение ингредиентов', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: fetchBurgerIngredients.pending.type };
      const state = burgerIngredientsReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const action = {
        type: fetchBurgerIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = burgerIngredientsReducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBe(null);
    });

    it('должен обрабатывать состояние rejected', () => {
      const error = 'Ошибка в получении данных о ингридиентах';
      const action = {
        type: fetchBurgerIngredients.rejected.type,
        error: { message: error }
      };
      const state = burgerIngredientsReducer(
        { ...initialState, isLoading: true },
        action
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
    });
  });
});
