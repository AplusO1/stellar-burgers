/* eslint-disable */
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { OrderInfo, IngredientDetails } from '@components';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, Modal } from '@components';
import { useDispatch } from '../../services/store';
import { ContainerDetails } from '../ui/container-details/container-details';
import { fetchBurgerIngredients } from '../../services/slices/burgerIngredientsSlice';
import { ProtectedRoute } from '../protected-route';
import { checkUserAuth } from '../../services/slices/authUserSlice';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();
  const id = location.pathname.split('/').at(-1);

  useEffect(() => {
    dispatch(fetchBurgerIngredients());
    dispatch(checkUserAuth());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route index element={<ConstructorPage />} />
        <Route
          path={'/ingredients/:id'}
          element={
            <ContainerDetails title={'Детали ингредиента'}>
              <IngredientDetails />
            </ContainerDetails>
          }
        />
        <Route path={'/feed'} element={<Feed />} />
        <Route
          path={'/feed/:number'}
          element={
            <ContainerDetails title={`#0${id}`}>
              <OrderInfo />
            </ContainerDetails>
          }
        />
        <Route
          path={'/login'}
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/register'}
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/forgot-password'}
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/reset-password'}
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/profile'}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/profile/orders'}
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/profile/orders/:number'}
          element={
            <ProtectedRoute>
              <ContainerDetails title={`#0${id}`}>
                <OrderInfo />
              </ContainerDetails>
            </ProtectedRoute>
          }
        />
        <Route
          path={'*'}
          element={
            <ContainerDetails>
              <NotFound404 />
            </ContainerDetails>
          }
        />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path={'/ingredients/:id'}
            element={
              <Modal
                title={'Детали ингредиента'}
                onClose={() => {
                  navigate('/');
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path={'/feed/:number'}
            element={
              <Modal title={`#0${id}`} onClose={() => navigate('/feed')}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={'/profile/orders/:number'}
            element={
              <ProtectedRoute>
                <Modal
                  title={`#0${id}`}
                  onClose={() => navigate('/profile/orders')}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
