import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { A, H1, H2 } from 'components/Text';
import { Spacing } from 'components/Layout';
import { NotFoundIcon } from 'components/icons';

import * as Routes from 'routes';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${(p) => p.theme.spacing.lg};
  padding: 0 ${(p) => p.theme.spacing.sm};
  text-align: center;
`;

/**
 * Component for displaying when we couldn't find the page
 */
const NotFound = ({ message, showHomePageLink }) => (
  <Root>
    <H1>Oops!</H1>

    <Spacing top="sm" bottom="md">
      <H2>{message}</H2>
    </Spacing>

    <NotFoundIcon width="100" />

    <Spacing bottom="md" />

    {showHomePageLink && <A to={Routes.HOME}>Go back to Home Page</A>}
  </Root>
);

NotFound.propTypes = {
  message: PropTypes.string,
  showHomePageLink: PropTypes.bool,
};

NotFound.defaultProps = {
  message: "We can't seem to find the page you're looking for.",
  showHomePageLink: true,
};

export default NotFound;
