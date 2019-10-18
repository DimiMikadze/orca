import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { HEADER_HEIGHT } from 'constants/Layout';

import MessagesUsers from './MessagesUsers';
import MessagesDetail from './MessagesDetail';

const Root = styled.div`
  background-color: ${p => p.theme.colors.white};
  position: relative;
  margin-top: -${HEADER_HEIGHT}px;
  padding-top: ${HEADER_HEIGHT}px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;

  @media (min-width: ${p => p.theme.screen.md}) {
    margin-left: ${p => p.theme.spacing.lg};
    border-left: 1px solid ${p => p.theme.colors.grey[300]};
    border-right: 1px solid ${p => p.theme.colors.grey[300]};
  }
`;

const Messages = ({ match }) => {
  return (
    <Root>
      <MessagesUsers />

      <MessagesDetail match={match} />
    </Root>
  );
};

Messages.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Messages;
