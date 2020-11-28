import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Overlay } from 'components/Layout';

import backgroundImage from './background.jpeg';

const Root = styled.div`
  background: url(${backgroundImage}) no-repeat top / cover;
  width: 100%;
  height: 100vh;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: ${(p) => p.theme.zIndex.lg};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (min-width: ${(p) => p.theme.screen.md}) {
    justify-content: center;
  }
`;

/**
 * Main Layout for the app, when user isn't authenticated
 */
const AuthLayout = ({ refetch }) => {
  return (
    <Root>
      <Overlay transparency="0.5" />

      <Container>
        <h1>Authentication</h1>
        <a href="http://localhost:4000/auth/facebook">Login with Facebook</a>
        <a href="http://localhost:4000/auth/google">Login with Google</a>
        <a href="http://localhost:4000/auth/github">Login with Github</a>
      </Container>
    </Root>
  );
};

AuthLayout.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AuthLayout;
