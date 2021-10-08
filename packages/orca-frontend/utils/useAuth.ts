import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../store/auth';
import { getCookie } from './cookie';

interface useAuthPayload {
  isAuthFetching: boolean;
  authError: any;
}

const useAuth = (): useAuthPayload => {
  const dispatch = useDispatch();
  const [isAuthFetching, setIsAuthFetching] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = getCookie('token');
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

        const {
          _id,
          role,
          fullName,
          username,
          image,
          imagePublicId,
          coverImage,
          coverImagePublicId,
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
            email,
            notifications,
            followers,
            following,
            isOnline: true,
          })
        );
        setAuthError(null);
      } catch (error) {
        setAuthError(error);
      } finally {
        setIsAuthFetching(false);
      }
    };

    fetch();
  }, [dispatch]);

  return { isAuthFetching, authError };
};

export default useAuth;
