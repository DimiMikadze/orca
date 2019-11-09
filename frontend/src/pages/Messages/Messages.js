import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useStore } from 'store';

import { HEADER_HEIGHT } from 'constants/Layout';

import MessagesUsers from './MessagesUsers';
import MessagesChat from './MessagesChat';

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
    border-left: 1px solid ${p => p.theme.colors.border.main};
    border-right: 1px solid ${p => p.theme.colors.border.main};
  }
`;

/**
 * Messages page
 */
const Messages = ({ match }) => {
  const [{ auth }] = useStore();

  return (
    <Root>
      <MessagesUsers authUser={auth.user} match={match} />

      <MessagesChat match={match} authUser={auth.user} />
    </Root>
  );
};

Messages.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Messages;
