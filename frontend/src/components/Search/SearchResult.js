import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { generatePath } from 'react-router-dom';

import { Spacing } from 'components/Layout';
import { A } from 'components/Text';
import Avatar from 'components/Avatar';

import * as Routes from 'routes';

const Root = styled.div`
  width: 100%;
  max-height: 350px;
  min-height: 40px;
  overflow: auto;
  position: absolute;
  top: 50px;
  font-size: ${(p) => p.theme.font.size.xs};
  box-shadow: ${(p) => p.theme.shadows.sm};
  background-color: ${(p) => p.theme.colors.white};
`;

const StyledA = styled(A)`
  display: block;

  &:hover {
    background-color: ${(p) => p.theme.colors.grey[100]};
  }
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${(p) => p.theme.spacing.xs};
`;

const Name = styled.div`
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

const UserName = styled.div`
  font-size: ${(p) => p.theme.font.size.xxs};
`;

const NoSearchResult = styled.div`
  text-align: center;
  padding: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.text.main};
`;

/**
 * Displays search result, meant to be used in Search component
 */
const SearchResult = ({ users, forMessage }) => {
  if (users.length < 1) {
    return (
      <Root>
        <NoSearchResult>No search results.</NoSearchResult>
      </Root>
    );
  }

  return (
    <Root>
      {users.map((user) => (
        <StyledA
          key={user.id}
          to={
            forMessage
              ? generatePath(Routes.MESSAGES, { userId: user.id })
              : generatePath(Routes.USER_PROFILE, { username: user.username })
          }
        >
          <Item>
            <Avatar image={user.image} size={34} />

            <Spacing left="xs">
              <Name>{user.fullName}</Name>
              <UserName>@{user.username}</UserName>
            </Spacing>
          </Item>
        </StyledA>
      ))}
    </Root>
  );
};

SearchResult.propTypes = {
  users: PropTypes.array.isRequired,
  forMessage: PropTypes.bool,
};

export default SearchResult;
