import React, { FC, useState, FormEvent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeAuthPopup, setAuthUser, PopupType, openAuthPopup, setToken } from '../../store/auth';
import { Container, InputText, Button, Spacing, Text, LinkButton } from '../ui';
import { RootState } from '../../store';
import axios from 'axios';
import { useMutation } from 'react-query';
import { setCookie } from '../../utils';

interface User {
  email: string;
  password: string;
}

const logIn = async (user: User) => {
  const response = await axios.post('/login', user);
  return response;
};

const INITIAL_STATE = {
  email: '',
  password: '',
};

const Login: FC = () => {
  const { isPopupOpen, popupType } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const { mutateAsync: logInMutation } = useMutation(logIn);
  const [values, setValues] = useState(INITIAL_STATE);

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const {
        data: { token, user },
      } = await logInMutation(values);
      dispatch(
        setAuthUser({
          ...user,
          isOnline: true,
        })
      );
      setCookie('token', token);
      dispatch(setToken(token));
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      dispatch(closeAuthPopup());
    } catch (error) {
      setErrorMessage(error.response.data);
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      setErrorMessage('');
    }

    return () => {
      setErrorMessage('');
      setValues(INITIAL_STATE);
    };
  }, [popupType, isPopupOpen]);

  return (
    <Container paddingHorizontal="none">
      <form onSubmit={onSubmit}>
        <InputText name="email" placeholder="Email" value={values.email} onChange={onChange} />
        <Spacing bottom="xs" />
        <InputText name="password" type="password" placeholder="Password" value={values.password} onChange={onChange} />
        {errorMessage && (
          <Spacing top="sm">
            <Text color="error">{errorMessage}</Text>
          </Spacing>
        )}
        <Spacing top="sm" bottom="sm">
          <LinkButton
            type="button"
            onClick={() => {
              dispatch(openAuthPopup(PopupType.Forgot_Password));
            }}
          >
            Forgot password?
          </LinkButton>
        </Spacing>
        <Button color="primary">Log in</Button>
        <Spacing top="sm">
          <Text size="sm" color="textSecondary">
            Don&apos;t have an account?
          </Text>
          <Spacing left="xxs" inline>
            <LinkButton
              type="button"
              onClick={() => {
                dispatch(openAuthPopup(PopupType.Sign_Up));
              }}
            >
              Sign up
            </LinkButton>
          </Spacing>
        </Spacing>
      </form>
    </Container>
  );
};

export default Login;
