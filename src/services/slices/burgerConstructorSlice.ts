import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface IBurgerConstructorState {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
}

const initialState: IBurgerConstructorState = {
  ingredients: [],
  bun: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientToBurgerConstructor: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },
    deleteIngredientFromBurgerConstructor: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    clearBurgerConstructor: (state) => {
      state.ingredients = [];
      state.bun = null;
    },
    changeIngredientLayer: (state, action) => {
      const initialElement = state.ingredients[action.payload.initialIndex];
      state.ingredients[action.payload.initialIndex] =
        state.ingredients[action.payload.finishIndex];
      state.ingredients[action.payload.finishIndex] = initialElement;
    }
  },
  selectors: {
    getIngredientsFromBurgerConstructor: (state) => state
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const burgerConstructorSliceName = burgerConstructorSlice.name;
export const {
  addIngredientToBurgerConstructor,
  deleteIngredientFromBurgerConstructor,
  clearBurgerConstructor,
  changeIngredientLayer
} = burgerConstructorSlice.actions;
export const { getIngredientsFromBurgerConstructor } =
  burgerConstructorSlice.selectors;
