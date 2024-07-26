import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  getUserOrders,
  getUserOrdersError
} from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getUserOrders);
  const error = useSelector(getUserOrdersError);
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

  return (
    <>
      {error ? (
        <p style={{ color: 'var(--colors-interface-error)' }}>error</p>
      ) : (
        <ProfileOrdersUI orders={orders} />
      )}
    </>
  );
};
