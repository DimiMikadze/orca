import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { A } from 'components/Text';
import { Container } from 'components/Layout';
import SignIn from './SignIn';

import * as Routes from 'routes';

import SiteInfo from 'constants/SiteInfo.json';

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px;
  background-color: transparent;
`;

const StyledContainer = styled(Container)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 ${p => p.theme.spacing.sm};

  @media (min-width: ${p => p.theme.screen.md}) {
    justify-content: space-between;
  }
`;

const Logo = styled(A)`
  display: none;
  color: ${p => p.theme.colors.white};
  font-size: ${p => p.theme.font.size.sm};
  font-weight: ${p => p.theme.font.weight.bold};

  &:hover {
    color: ${p => p.theme.colors.white};
  }

  @media (min-width: ${p => p.theme.screen.md}) {
    display: block;
  }
`;

const SignInContainer = styled.div`
  width: 500px;
`;

/**
 * Header of the App when user isn't authenticated
 */
const AuthHeader = ({ refetch }) => {
  return (
    <Root>
      <StyledContainer maxWidth="lg">
        <Logo to={Routes.HOME}>{SiteInfo.name}</Logo>

        <SignInContainer>
          <SignIn refetch={refetch} />
        </SignInContainer>
      </StyledContainer>
    </Root>
  );
};

AuthHeader.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AuthHeader;
