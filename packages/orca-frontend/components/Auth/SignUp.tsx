import React, { FC, useState, FormEvent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PopupType, openAuthPopup, setAuthUser, setToken, closeAuthPopup } from '../../store/auth';
import { Container, InputText, Button, Spacing, Text, LinkButton } from '../ui';
import { SuccessContainer, SocialButton, Or, Bottom } from './style';
import { RootState } from '../../store';
import axios from 'axios';
import { useMutation } from 'react-query';
import { GoogleIcon, FacebookIcon, GithubIcon, SuccessIcon } from '../ui/icons';
import { Config, Cookies, setCookie } from '../../utils';

interface User {
  fullName: string;
  email: string;
  password: string;
}

const signUp = async (user: User) => {
  const response = await axios.post('/signup', user);
  return response;
};

const INITIAL_STATE = {
  fullName: '',
  email: '',
  password: '',
};

const SignUp: FC = () => {
  const { isPopupOpen, popupType } = useSelector((state: RootState) => state.auth);
  const { isEmailVerificationRequired, facebookLoginEnabled, githubLoginEnabled, googleLoginEnabled } = useSelector(
    (state: RootState) => state.settings
  );
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const { mutateAsync: signUpMutation } = useMutation(signUp);
  const [values, setValues] = useState(INITIAL_STATE);
  const [successResponse, setSuccessResponse] = useState('');

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const { data } = await signUpMutation(values);
      if (isEmailVerificationRequired) {
        setSuccessResponse(
          `Email verification instructions have been sent to the ${values.email} email address. Please note that the link will expire in 1 hour.`
        );
        return;
      }

      const { user, token } = data;
      dispatch(
        setAuthUser({
          ...user,
          isOnline: true,
        })
      );
      dispatch(setToken(token));
      setCookie(Cookies.Token, token);
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
      {successResponse ? (
        <SuccessContainer>
          <SuccessIcon width="50" />
          <Spacing left="sm" />
          <Text color="textSecondary">{successResponse}</Text>
        </SuccessContainer>
      ) : (
        <form onSubmit={onSubmit}>
          {(facebookLoginEnabled || githubLoginEnabled || googleLoginEnabled) && (
            <>
              {facebookLoginEnabled && (
                <SocialButton href={`${Config.API_URL}/facebook`}>
                  <FacebookIcon color="facebook" /> Continue with Facebook <div></div>
                </SocialButton>
              )}

              {googleLoginEnabled && (
                <SocialButton href={`${Config.API_URL}/google`}>
                  <GoogleIcon /> Continue with Google <div></div>
                </SocialButton>
              )}

              {githubLoginEnabled && (
                <SocialButton href={`${Config.API_URL}/github`}>
                  <GithubIcon /> Continue with Github <div></div>
                </SocialButton>
              )}

              <Or>OR</Or>
            </>
          )}

          <InputText name="fullName" placeholder="Full Name" value={values.fullName} onChange={onChange} />
          <Spacing bottom="xs" />
          <InputText name="email" placeholder="Email" value={values.email} onChange={onChange} />
          <Spacing bottom="xs" />
          <InputText
            name="password"
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={onChange}
          />
          {errorMessage && (
            <Spacing top="sm">
              <Text color="error">{errorMessage}</Text>
            </Spacing>
          )}
          <Spacing bottom="sm" />

          <Bottom>
            <Button color="primary" fullWidth>
              Sign up
            </Button>
            <Spacing top="sm">
              <Text size="xs" color="textSecondary">
                Already have an account?
              </Text>
              <Spacing left="xxs" inline>
                <LinkButton
                  size="xs"
                  type="button"
                  onClick={() => {
                    dispatch(openAuthPopup(PopupType.Log_In));
                  }}
                >
                  Log in
                </LinkButton>
              </Spacing>
            </Spacing>
          </Bottom>
        </form>
      )}
    </Container>
  );
};

export default SignUp;
