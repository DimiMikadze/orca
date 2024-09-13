import axios from 'axios';
import { FC, FormEvent, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AuthActionTypes, PopupType, openAuthPopup } from '../../store/auth';
import { Button, Container, InputText, LinkButton, Spacing, Text } from '../ui';
import { Dispatch } from 'redux';

const forgotPassword = async (email: string) => {
  const response = await axios.post('/forgot-password', { email });
  return response;
};

const ForgotPassword: FC = () => {
  const { isPopupOpen, popupType } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<Dispatch<AuthActionTypes>>();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { mutateAsync: forgotPasswordMutation } = useMutation(forgotPassword);
  const [email, setEmail] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await forgotPasswordMutation(email);
      setSuccessMessage(response.data);
      setEmail('');
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
      setEmail('');
    };
  }, [popupType, isPopupOpen]);

  return (
    <Container paddingHorizontal="none">
      <form onSubmit={onSubmit}>
        <InputText name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
          Request Reset
        </Button>
        <Spacing top="sm">
          <LinkButton
            size="xs"
            type="button"
            onClick={() => {
              dispatch(openAuthPopup(PopupType.Log_In));
            }}
          >
            &larr; Go back
          </LinkButton>
        </Spacing>
      </form>
    </Container>
  );
};

export default ForgotPassword;
