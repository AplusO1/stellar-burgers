import {
  authUserReducer,
  fetchLoginUser,
  fetchRegisterUser,
  fetchUpdateUser,
  fetchLogoutUser,
  fetchGetUser,
  checkUserAuth,
  initialState
} from './authUserSlice';
import { TUser } from '@utils-types';

// Мокируем функции cookie
jest.mock('../../utils/cookie', () => ({
  deleteCookie: jest.fn(),
  setCookie: jest.fn(),
  getCookie: jest.fn()
}));

// Мокируем localStorage
const localStorageMock = (function () {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('authUserSlice', () => {
  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'test user'
  };

  it('должен обрабатывать начальное состояние', () => {
    expect(authUserReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('вход пользователя', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: fetchLoginUser.pending.type };
      const state = authUserReducer(initialState, action);
      expect(state.loginUserRequest).toBe(true);
      expect(state.errorLogin).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const action = {
        type: fetchLoginUser.fulfilled.type,
        payload: mockUser
      };
      const state = authUserReducer(initialState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.errorLogin).toBeNull();
    });

    it('должен обрабатывать состояние rejected', () => {
      const action = {
        type: fetchLoginUser.rejected.type,
        error: { message: 'Ошибка в получении доступа к личному кабинету' }
      };
      const state = authUserReducer(
        { ...initialState, loginUserRequest: true },
        action
      );
      expect(state.loginUserRequest).toBe(false);
      expect(state.errorLogin).toBe(
        'Ошибка в получении доступа к личному кабинету'
      );
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('регистрация пользователя', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: fetchRegisterUser.pending.type };
      const state = authUserReducer(initialState, action);
      expect(state.loginUserRequest).toBe(true);
      expect(state.errorRegistration).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const action = {
        type: fetchRegisterUser.fulfilled.type,
        payload: mockUser
      };
      const state = authUserReducer(initialState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.userData).toEqual(mockUser);
      expect(state.errorRegistration).toBeNull();
    });

    it('должен обрабатывать состояние rejected', () => {
      const action = {
        type: fetchRegisterUser.rejected.type,
        error: { message: 'Ошибка в регистристрации пользователя' }
      };
      const state = authUserReducer(
        { ...initialState, loginUserRequest: true },
        action
      );
      expect(state.loginUserRequest).toBe(false);
      expect(state.errorRegistration).toBe(
        'Ошибка в регистристрации пользователя'
      );
    });
  });

  describe('выход пользователя', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: fetchLogoutUser.pending.type };
      const state = authUserReducer(
        { ...initialState, userData: mockUser, isAuthChecked: true },
        action
      );
      expect(state.loginUserRequest).toBe(true);
      expect(state.errorLogout).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const action = { type: fetchLogoutUser.fulfilled.type };
      const state = authUserReducer(
        {
          ...initialState,
          userData: mockUser,
          isAuthChecked: true,
          loginUserRequest: true
        },
        action
      );
      expect(state.loginUserRequest).toBe(false);
      expect(state.userData).toBeNull();
      expect(state.errorLogout).toBeNull();
      expect(localStorage.clear).toHaveBeenCalled();
    });

    it('должен обрабатывать состояние rejected', () => {
      const action = {
        type: fetchLogoutUser.rejected.type,
        error: { message: 'Ошибка выхода из аккаунта пользователя' }
      };
      const state = authUserReducer(
        { ...initialState, loginUserRequest: true },
        action
      );
      expect(state.loginUserRequest).toBe(false);
      expect(state.errorLogout).toBe('Ошибка выхода из аккаунта пользователя');
    });
  });

  describe('обновление пользователя', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: fetchUpdateUser.pending.type };
      const state = authUserReducer(
        { ...initialState, userData: mockUser },
        action
      );
      expect(state.loginUserRequest).toBe(true);
      expect(state.userData).toBeNull();
      expect(state.errorUpdate).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Обновленный пользователь' };
      const action = {
        type: fetchUpdateUser.fulfilled.type,
        payload: { user: updatedUser }
      };
      const state = authUserReducer(initialState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.userData).toEqual(updatedUser);
      expect(state.errorUpdate).toBeNull();
    });

    it('должен обрабатывать состояние rejected', () => {
      const action = {
        type: fetchUpdateUser.rejected.type,
        error: { message: 'Ошибка в обновлении данных пользователя' }
      };
      const state = authUserReducer(
        { ...initialState, loginUserRequest: true },
        action
      );
      expect(state.loginUserRequest).toBe(false);
      expect(state.errorUpdate).toBe('Ошибка в обновлении данных пользователя');
    });
  });

  describe('проверка аутентификации пользователя', () => {
    it('должен обрабатывать состояние pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = authUserReducer(initialState, action);
      expect(state.errorLogin).toBeNull();
      expect(state.errorRegistration).toBeNull();
      expect(state.errorLogout).toBeNull();
    });

    it('должен обрабатывать состояние fulfilled', () => {
      const action = {
        type: fetchGetUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = authUserReducer(initialState, action);
      expect(state.userData).toEqual(mockUser);
    });
  });

  describe('получение данных пользователя', () => {
    it('должен обрабатывать состояние fulfilled', () => {
      const action = {
        type: fetchGetUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = authUserReducer(initialState, action);
      expect(state.userData).toEqual(mockUser);
    });
  });
});
