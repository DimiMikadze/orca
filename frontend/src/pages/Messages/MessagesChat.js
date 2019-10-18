import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink, generatePath } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { GET_CONVERSATIONS } from 'graphql/user';

import SearchInput from 'components/SearchInput';
import { PencilIcon } from 'components/icons';
import { LoadingDots } from 'components/Loading';

import * as Routes from 'routes';

const Root = styled.div`
  width: 80px;
  height: 100%;
  border-right: 1px solid ${p => p.theme.colors.grey[300]};

  @media (min-width: ${p => p.theme.screen.lg}) {
    width: 330px;
  }
`;

const HeadingContainer = styled.div`
  border-bottom: 1px solid ${p => p.theme.colors.grey[300]};
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

const SearchInputContainer = styled.div`
  display: none;
  border-bottom: 1px solid ${p => p.theme.colors.grey[300]};

  @media (min-width: ${p => p.theme.screen.lg}) {
    display: block;
  }
`;

const UserContainer = styled.div`
  margin-top: ${p => p.theme.spacing.sm};
`;

const User = styled(NavLink)`
  margin: 0 ${p => p.theme.spacing.xxs};
  padding: ${p => p.theme.spacing.xxs} ${p => p.theme.spacing.xxs};
  border-radius: ${p => p.theme.radius.md};
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;

  &.selected {
    background-color: ${p => p.theme.colors.grey[100]};
  }
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  display: none;
  padding-left: ${p => p.theme.spacing.xs};

  @media (min-width: ${p => p.theme.screen.lg}) {
    display: block;
  }
`;

const UserFullName = styled.div`
  font-size: ${p => p.theme.font.size.sm};
  color: ${p => p.theme.colors.text.primary};
`;

const UserCreatedAt = styled.span`
  font-size: ${p => p.theme.font.size.xxs};
  color: ${p => p.theme.colors.text.secondary};
`;

const MessagesChat = ({ authUser, match }) => {
  const { data, loading } = useQuery(GET_CONVERSATIONS, {
    variables: { authUserId: authUser.id },
  });

  return (
    <Root>
      <HeadingContainer>
        <Heading>Chats</Heading>

        <NewMessage
          exact
          activeClassName="selected"
          to={generatePath(Routes.MESSAGES_DETAIL, { userId: 'new' })}
        >
          <PencilIcon />
        </NewMessage>
      </HeadingContainer>

      <SearchInputContainer>
        <SearchInput
          backgroundColor="white"
          placeholder="Search Messages"
          onChange={() => {}}
          value=""
        />
      </SearchInputContainer>

      {loading && <LoadingDots top="xl" />}

      {!loading && (
        <UserContainer>
          {data.getConversations.map(user => (
            <User
              key={user.id}
              activeClassName="selected"
              to={`/messages/${user.id}`}
            >
              <Image src={user.image} alt={user.fullName} />

              <UserInfo>
                <UserFullName>{user.fullName}</UserFullName>
                <UserCreatedAt>{user.createdAt}</UserCreatedAt>
              </UserInfo>
            </User>
          ))}
        </UserContainer>
      )}
    </Root>
  );
};

MessagesChat.propTypes = {
  authUser: PropTypes.object.isRequired,
};

export default MessagesChat;
