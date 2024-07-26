import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  burgerIngredientsReducer,
  burgerIngredientsSliceName
} from './slices/burgerIngredientsSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  burgerConstructorReducer,
  burgerConstructorSliceName
} from './slices/burgerConstructorSlice';

import { useState, ChangeEvent } from 'react';
import { feedReducer, feedSliceName } from './slices/feedSlice';
import { orderDetailName, orderDetailReducer } from './slices/orderSlice';
import { authUserReducer, authUserSliceName } from './slices/authUserSlice';
import { ordersReducer, ordersSliceName } from './slices/userOrdersSlice';

const rootReducer = combineReducers({
  [burgerIngredientsSliceName]: burgerIngredientsReducer,
  [burgerConstructorSliceName]: burgerConstructorReducer,
  [feedSliceName]: feedReducer,
  [orderDetailName]: orderDetailReducer,
  [authUserSliceName]: authUserReducer,
  [ordersSliceName]: ordersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  return { values, handleChange, setValues };
};

export default store;
