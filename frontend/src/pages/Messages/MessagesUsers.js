import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import SearchInput from 'components/SearchInput';

import usersData from './users.json';

const Root = styled.div`
  width: 80px;
  height: 100%;
  border-right: 1px solid ${p => p.theme.colors.grey[300]};

  @media (min-width: ${p => p.theme.screen.lg}) {
    width: 330px;
  }
`;

const HeadingContainer = styled.div`
  display: none;
  border-bottom: 1px solid ${p => p.theme.colors.grey[300]};
  height: 60px;
  padding-left: ${p => p.theme.spacing.xs};

  @media (min-width: ${p => p.theme.screen.lg}) {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

const Heading = styled.h4`
  display: none;
  color: ${p => p.theme.colors.text.primary};
  margin: 0;

  @media (min-width: ${p => p.theme.screen.lg}) {
    display: block;
  }
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

const MessagesUsers = () => {
  return (
    <Root>
      <HeadingContainer>
        <Heading>Messages</Heading>
      </HeadingContainer>

      <SearchInputContainer>
        <SearchInput
          backgroundColor="white"
          placeholder="Search Messages"
          onChange={() => {}}
          value=""
        />
      </SearchInputContainer>

      <UserContainer>
        {usersData.map(user => (
          <User
            key={user.username}
            activeClassName="selected"
            to={`/messages/${user.username}`}
          >
            <Image src={user.image} alt={user.fullName} />

            <UserInfo>
              <UserFullName>{user.fullName}</UserFullName>
              <UserCreatedAt>{user.createdAt}</UserCreatedAt>
            </UserInfo>
          </User>
        ))}
      </UserContainer>
    </Root>
  );
};

export default MessagesUsers;
