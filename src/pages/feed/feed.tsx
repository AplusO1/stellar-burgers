import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeed,
  getErrorFeed,
  getFeedOrders
} from '../../services/slices/feedSlice';
import { Outlet } from 'react-router-dom';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getFeedOrders);
  const ordersError = useSelector(getErrorFeed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, []);
  if (ordersError) {
    return (
      <p style={{ color: 'var(--colors-interface-error)' }}>{ordersError}</p>
    );
  }
  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(fetchFeed());
        }}
      />
      <Outlet />
    </>
  );
};
