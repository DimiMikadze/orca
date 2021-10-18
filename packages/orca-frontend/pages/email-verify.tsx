import React, { useEffect, useState } from 'react';
import { Container, Spacing, H3, Button, LoadingDots, Link } from '../components/ui';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setToken } from '../store/auth';
import { Cookies, setCookie } from '../utils';
import { RootState } from '../store';
import { AlertTypes, openAlert } from '../store/alert';
import Seo from '../components/Seo';

const EmailVerify = ({ email, token }) => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const logo = useSelector((state: RootState) => state.settings.communityLogo);

  useEffect(() => {
    if (!email || !token) {
      setError('Email verification has been failed due to invalid arguments.');
      setIsLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const response = await axios.post('/email-verify', { email, token });
        const { token: responseToken, user } = response.data;
        dispatch(
          setAuthUser({
            ...user,
            isOnline: true,
          })
        );
        setCookie(Cookies.Token, responseToken);
        dispatch(setToken(responseToken));
        axios.defaults.headers.common = { Authorization: `bearer ${responseToken}` };
        router.push('/');
        dispatch(
          openAlert({
            message: 'Email confirmed successfully.',
            type: AlertTypes.Success,
          })
        );
      } catch (error) {
        setError(error.response.data);
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [email, token, dispatch, router]);

  return (
    <Container centered>
      <Seo title="Email Verification" />
      <Spacing top="md" bottom="lg">
        <Link href="/" disableBorderOnHover>
          <img alt="logo" style={{ height: 30 }} src={logo} />
        </Link>
      </Spacing>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <>
          {error && <H3 color="error">{error}</H3>}
          <Spacing top="lg">
            <Button color="primary" inline onClick={() => router.push('/')}>
              &larr; Go to home page
            </Button>
          </Spacing>{' '}
        </>
      )}
    </Container>
  );
};

EmailVerify.getInitialProps = async ({ query }) => {
  return { ...query };
};

export default EmailVerify;
