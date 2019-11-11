import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink, generatePath, withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { GET_CONVERSATIONS } from 'graphql/user';
import { GET_NEW_CONVERSATIONS_SUBSCRIPTION } from 'graphql/messages';

import Search from 'components/Search';
import { PencilIcon } from 'components/icons';
import { LoadingDots } from 'components/Loading';
import Avatar from 'components/Avatar';

import * as Routes from 'routes';

const Root = styled.div`
  width: 80px;
  height: 100%;
  border-right: 1px solid ${p => p.theme.colors.border.main};

  @media (min-width: ${p => p.theme.screen.lg}) {
    width: 330px;
  }
`;

const HeadingContainer = styled.div`
  border-bottom: 1px solid ${p => p.theme.colors.border.main};
  height: 60px;
  padding: 0 ${p => p.theme.spacing.xs};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (min-width: ${p => p.theme.screen.lg}) {
    justify-content: space-between;
  }
`;

const Heading = styled.h3`
  display: none;
  color: ${p => p.theme.colors.text.primary};
  margin: 0;

  @media (min-width: ${p => p.theme.screen.lg}) {
    display: block;
  }
`;

const NewMessage = styled(NavLink)`
  width: 40px;
  height: 40px;
  background-color: ${p => p.theme.colors.grey[200]};
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: none;
  border-bottom: 1px solid ${p => p.theme.colors.border.main};

  @media (min-width: ${p => p.theme.screen.lg}) {
    display: block;
  }
`;

const UserContainer = styled.div`
  margin-top: ${p => p.theme.spacing.sm};
  padding: 0 ${p => p.theme.spacing.xxs};
`;

const User = styled(NavLink)`
  width: 100%;
  padding: ${p => p.theme.spacing.xxs} ${p => p.theme.spacing.xxs};
  margin-bottom: ${p => p.theme.spacing.xxs};
  border-radius: ${p => p.theme.radius.md};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-decoration: none;
  color: ${p => p.theme.colors.text.primary};

  @media (max-width: ${p => p.theme.screen.lg}) {
    ${p =>
      !p.seen &&
      `
        background-color: ${p.theme.colors.primary.light};
      `};
  }

  &.selected {
    background-color: ${p => p.theme.colors.grey[100]};
  }
`;

const Info = styled.div`
  width: 100%;
  display: none;
  padding: 0 ${p => p.theme.spacing.xs};

  @media (min-width: ${p => p.theme.screen.lg}) {
    display: block;
  }
`;

const FullNameUnSeen = styled.div`
  width: 100%;
  font-size: ${p => p.theme.font.size.sm};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FullName = styled.div`
  text-overflow: ellipsis;
  width: 100%;
`;

const UnSeen = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${p => p.theme.colors.primary.light};
  border-radius: 50%;
`;

const LastMessage = styled.div`
  margin-top: ${p => p.theme.spacing.xxs};
  font-size: ${p => p.theme.font.size.xxs};
  color: ${p => p.theme.colors.grey[500]};
  text-overflow: ellipsis;
`;

/**
 * Component that renders users, with whom auth user had a chat
 */
const MessagesUsers = ({ location, authUser }) => {
  const { subscribeToMore, data, loading } = useQuery(GET_CONVERSATIONS, {
    variables: { authUserId: authUser.id },
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: GET_NEW_CONVERSATIONS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { newConversation } = subscriptionData.data;
        const oldConversations = prev.getConversations;

        if (oldConversations.some(u => u.id === newConversation.id)) {
          return prev;
        }

        // Merge conversations
        const conversations = newConversation;
        delete conversations['receiverId'];
        const mergedConversations = [newConversation, ...oldConversations];

        return { getConversations: mergedConversations };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);

  return (
    <Root>
      <HeadingContainer>
        <Heading>Chats</Heading>

        <NewMessage
          exact
          activeClassName="selected"
          to={generatePath(Routes.MESSAGES, { userId: Routes.NEW_ID_VALUE })}
        >
          <PencilIcon />
        </NewMessage>
      </HeadingContainer>

      <SearchContainer>
        <Search
          location={location}
          backgroundColor="white"
          forMessage
          placeholder="Search message"
        />
      </SearchContainer>

      {loading && <LoadingDots top="xl" />}

      {!loading && (
        <UserContainer>
          {data.getConversations.map(user => {
            const unseen = !user.lastMessageSender && !user.seen;

            return (
              <User
                key={user.id}
                activeClassName="selected"
                to={`/messages/${user.id}`}
                seen={unseen ? 0 : 1}
              >
                <span>
                  <Avatar image={user.image} size={50} />
                </span>

                <Info>
                  <FullNameUnSeen>
                    <FullName>{user.fullName}</FullName>

                    {unseen && <UnSeen />}
                  </FullNameUnSeen>

                  <LastMessage>
                    {user.lastMessageSender && 'You:'} {user.lastMessage}
                  </LastMessage>
                </Info>
              </User>
            );
          })}
        </UserContainer>
      )}
    </Root>
  );
};

MessagesUsers.propTypes = {
  location: PropTypes.object.isRequired,
  authUser: PropTypes.object.isRequired,
};

export default withRouter(MessagesUsers);
