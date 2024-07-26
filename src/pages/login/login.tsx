import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector, useForm } from '../../services/store';
import {
  fetchLoginUser,
  getErrorLogin,
  getLoginUserRequest
} from '../../services/slices/authUserSlice';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const errorText = useSelector(getErrorLogin) || undefined;
  const request = useSelector(getLoginUserRequest);
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(fetchLoginUser(values));
  };

  return (
    <>
      {request ? (
        <Preloader />
      ) : (
        <LoginUI
          errorText={errorText}
          email={values.email}
          setEmail={(email) =>
            handleChange({ target: { name: 'email', value: email } } as any)
          }
          password={values.password}
          setPassword={(password) =>
            handleChange({
              target: { name: 'password', value: password }
            } as any)
          }
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};
