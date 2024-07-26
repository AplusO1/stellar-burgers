import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { Outlet } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getUserData } from '../../services/slices/authUserSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(getUserData)?.name || '';
  return (
    <>
      <AppHeaderUI userName={userName} />
      <Outlet />
    </>
  );
};
