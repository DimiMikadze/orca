import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink, generatePath } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import { UPDATE_MESSAGE_SEEN } from 'graphql/messages';
import { GET_AUTH_USER } from 'graphql/user';

import Avatar from 'components/Avatar';
import { A } from 'components/Text';

import { timeAgo } from 'utils/date';

import * as Routes from 'routes';

import { useStore } from 'store';

const Root = styled.div`
  position: absolute;
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  background-color: white;
  right: 0;
  top: 60px;
  z-index: ${p => p.theme.zIndex.xl};
  box-shadow: ${p => p.theme.shadows.xl};

  @media (min-width: ${p => p.theme.screen.sm}) {
    width: 500px;
    right: 90px;
  }
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.xs};
  border-bottom: 1px solid ${p => p.theme.colors.grey[300]};
`;

const Link = styled(A)`
  color: ${p => p.theme.colors.primary.main};
  font-size: ${p => p.theme.font.size.xs};

  &:hover {
    color: ${p => p.theme.colors.primary.main};
    text-decoration: underline;
  }
`;

const Empty = styled.div`
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.xs};
`;

const User = styled(NavLink)`
  width: 100%;
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.xxs};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
  color: ${p => p.theme.colors.text.primary};

  &:hover {
    background-color: ${p => p.theme.colors.grey[100]};
  }
`;

const Info = styled.div`
  width: 100%;
  padding: 0 ${p => p.theme.spacing.xs};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FullName = styled.div`
  text-overflow: ellipsis;
  width: 100%;
`;

const LastMessage = styled.div`
  margin-top: ${p => p.theme.spacing.xxs};
  font-size: ${p => p.theme.font.size.xxs};
  color: ${p => p.theme.colors.grey[500]};
  text-overflow: ellipsis;
`;

const CreatedAt = styled.div`
  font-size: ${p => p.theme.font.size.tiny};
  color: ${p => p.theme.colors.text.secondary};
`;

/**
 * Component that renders Header Message's dropdown
 */
const HeaderMessageDropdown = ({ messageRef, dropdownData }) => {
  const [{ auth }] = useStore();
  const client = useApolloClient();

  useEffect(() => {
    const updateMessageSeen = async userId => {
      try {
        await client.mutate({
          mutation: UPDATE_MESSAGE_SEEN,
          variables: {
            input: {
              receiver: auth.user.id,
              sender: userId,
            },
          },
          refetchQueries: () => [{ query: GET_AUTH_USER }],
        });
      } catch (err) {}
    };

    dropdownData.map(u => updateMessageSeen(u.id));
  }, [auth.user.id, client, dropdownData]);

  return (
    <Root ref={messageRef}>
      <Heading>
        <Link
          to={generatePath(Routes.MESSAGES, { userId: Routes.NEW_ID_VALUE })}
        >
          New Message
        </Link>
      </Heading>

      {!dropdownData.length ? (
        <Empty>No new messages.</Empty>
      ) : (
        dropdownData.map(user => (
          <User
            key={user.id}
            to={generatePath(Routes.MESSAGES, { userId: user.id })}
          >
            <span>
              <Avatar image={user.image} size={50} />
            </span>

            <Info>
              <div>
                <FullName>{user.fullName}</FullName>

                <LastMessage>{user.lastMessage}</LastMessage>
              </div>

              <CreatedAt>{timeAgo(user.lastMessageCreatedAt)}</CreatedAt>
            </Info>
          </User>
        ))
      )}
    </Root>
  );
};

HeaderMessageDropdown.propTypes = {
  messageRef: PropTypes.object,
  dropdownData: PropTypes.array,
};

export default HeaderMessageDropdown;
