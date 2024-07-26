import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearBurgerConstructor,
  getIngredientsFromBurgerConstructor
} from '../../services/slices/burgerConstructorSlice';
import { useNavigate } from 'react-router-dom';

import {
  clearOrderState,
  fetchCreateOrder,
  getOrder,
  getOrderRequest
} from '../../services/slices/orderSlice';

import { getUserData } from '../../services/slices/authUserSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(getIngredientsFromBurgerConstructor);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrder);
  const navigate = useNavigate();
  const userData = useSelector(getUserData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!userData) {
      navigate('/login'), { replace: true };
      return;
    }
    const ingredientsId = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(fetchCreateOrder(ingredientsId))
      .unwrap()
      .then(() => {
        dispatch(clearBurgerConstructor());
      });
  };
  const closeOrderModal = () => {
    dispatch(clearOrderState());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
