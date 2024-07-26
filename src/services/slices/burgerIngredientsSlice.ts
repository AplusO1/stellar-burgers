import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IBurgerIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IBurgerIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchBurgerIngredients = createAsyncThunk(
  'burgerIngredients/fetchBurgerIngredients',
  async () => getIngredientsApi()
);

const burgerIngredientsSlice = createSlice({
  name: 'burgerIngredients',
  initialState,
  reducers: {},
  selectors: {
    getBurgerIngredients: (state) => state.ingredients,
    getIsLoading: (state) => state.isLoading,
    getBurgerIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBurgerIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBurgerIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBurgerIngredients.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка в получении данных о ингридиентах';
      });
  }
});

export const burgerIngredientsReducer = burgerIngredientsSlice.reducer;
export const burgerIngredientsSliceName = burgerIngredientsSlice.name;
export const { getBurgerIngredients, getIsLoading, getBurgerIngredientsError } =
  burgerIngredientsSlice.selectors;
