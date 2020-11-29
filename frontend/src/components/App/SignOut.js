import React from 'react';
import { useApolloClient } from '@apollo/client';

import { Button } from 'components/Form';

import { useStore } from 'store';
import { CLEAR_AUTH_USER } from 'store/auth';

/**
 * Component that signs out the user
 */
const SignOut = () => {
  const client = useApolloClient();
  const [, dispatch] = useStore();

  const handleSignOut = () => {
    dispatch({ type: CLEAR_AUTH_USER });
    client.resetStore();
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/signout`;
  };

  return (
    <Button text onClick={handleSignOut}>
      Sign out
    </Button>
  );
};

export default SignOut;
