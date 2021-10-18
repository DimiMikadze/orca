import React, { FC, useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Container, InputText, Button, Spacing, Text, H1 } from '../ui';
import { RootState } from '../../store';
import { useMutation } from 'react-query';
import { setAuthUser, setToken } from '../../store/auth';
import { Cookies, setCookie } from '../../utils';

interface resetPasswordProps {
  password: string;
  email: string;
  token: string;
}

const resetPassword = async (params: resetPasswordProps) => {
  const response = await axios.post('/reset-password', params);
  return response;
};

const INITIAL_STATE = {
  password: '',
  confirmPassword: '',
};

const ResetPassword: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isPopupOpen, popupType } = useSelector((state: RootState) => state.auth);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { mutateAsync: resetPasswordMutation } = useMutation(resetPassword);
  const [values, setValues] = useState(INITIAL_STATE);

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    const { query } = router;

    if (!query.email || !query.token) {
      setErrorMessage('The link is broken');
      return;
    }

    try {
      const response = await resetPasswordMutation({
        password: values.password,
        email: query.email as string,
        token: query.token as string,
      });

      const {
        data: { user, token },
      } = response;
      dispatch(
        setAuthUser({
          ...user,
          isOnline: true,
        })
      );
      setCookie(Cookies.Token, token);
      dispatch(setToken(token));
      setSuccessMessage('Password has been changed successfully.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
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
    <Container maxWidth="xs" paddingHorizontal="none">
      <H1>Reset Password</H1>
      <Spacing bottom="sm" />

      <form onSubmit={onSubmit}>
        <InputText
          type="password"
          name="password"
          placeholder="New Password"
          value={values.password}
          onChange={onChange}
        />
        <Spacing bottom="xs" />

        <InputText
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={values.confirmPassword}
          onChange={onChange}
        />
        <Spacing bottom="xs" />

        <Spacing bottom="xs" />
        {errorMessage && (
          <Spacing top="sm">
            <Text color="error">{errorMessage}</Text>
          </Spacing>
        )}
        {successMessage && (
          <Spacing top="sm">
            <Text color="success">{successMessage}</Text>
          </Spacing>
        )}
        <Spacing bottom="sm" />
        <Button color="primary" fullWidth>
          Reset Password
        </Button>
      </form>
    </Container>
  );
};

export default ResetPassword;
