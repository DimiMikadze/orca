import axios from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Cookies, setCookie } from '.';
import { AlertTypes, openAlert } from '../store/alert';
import { setAuthUser, setToken } from '../store/auth';
import { getCookie } from './cookie';

interface useAuthPayload {
  isAuthFetching: boolean;
  authError: any;
}

const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const useAuth = (): useAuthPayload => {
  const dispatch = useDispatch();
  const [isAuthFetching, setIsAuthFetching] = useState(true);
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  const dispatchAuthUser = useCallback(
    (data: any) => {
      const {
        _id,
        role,
        fullName,
        username,
        image,
        imagePublicId,
        coverImage,
        coverImagePublicId,
        facebookId,
        googleId,
        githubId,
        about,
        website,
        email,
        notifications,
        followers,
        following,
      } = data;
      dispatch(
        setAuthUser({
          _id,
          role,
          image,
          imagePublicId,
          coverImage,
          coverImagePublicId,
          fullName,
          username,
          facebookId,
          googleId,
          githubId,
          about,
          website,
          email,
          notifications,
          followers,
          following,
          isOnline: true,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (!router.query?.auth || router.query?.auth !== 'social') {
      return;
    }

    const responseType = router.query?.responseType;
    const provider = router.query?.provider;

    if (responseType !== 'success' && responseType !== 'error') {
      return;
    }

    if (!provider) {
      return;
    }

    if (responseType === 'error') {
      dispatch(
        openAlert({
          type: AlertTypes.Error,
          message: `An error occurred while signing in with ${capitalizeFirstLetter(provider as string)}.`,
        })
      );
      return;
    }

    const token = router.query?.token as string;
    if (!token) {
      return;
    }

    const fetch = async () => {
      axios.defaults.headers.common = { Authorization: `bearer ${token}` };
      const { data } = await axios.get('/auth-user');
      if (!data) {
        return;
      }

      setCookie(Cookies.Token, token);
      dispatch(setToken(token));
      dispatchAuthUser(data);
      router.replace('/', undefined, { shallow: true });
    };

    fetch();
  }, [router, dispatch, dispatchAuthUser]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = getCookie(Cookies.Token);
        if (!token) {
          setIsAuthFetching(false);
          return;
        }

        axios.defaults.headers.common = { Authorization: `bearer ${token}` };
        const { data } = await axios.get('/auth-user');
        if (!data) {
          setIsAuthFetching(false);
          return;
        }
        dispatchAuthUser(data);
        setAuthError(null);
      } catch (error) {
        setAuthError(error);
      } finally {
        setIsAuthFetching(false);
      }
    };

    fetch();
  }, [dispatch, dispatchAuthUser]);

  return { isAuthFetching, authError };
};

export default useAuth;
