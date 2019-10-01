import React from 'react';
import styled from 'styled-components';
import { generatePath } from 'react-router-dom';
import { Query } from 'react-apollo';

import { Loading } from 'components/Loading';
import { H3, A } from 'components/Text';
import { Spacing } from 'components/Layout';
import { UserIcon } from 'components/icons';

import { useStore } from 'store';

import { USER_SUGGESTIONS } from 'graphql/user';

import { USER_SUGGESTIONS_WIDTH, HEADER_HEIGHT } from 'constants/Layout';

import * as Routes from 'routes';

const Root = styled.div`
  display: none;
  background-color: ${p => p.theme.colors.white};
  box-shadow: ${p => p.theme.shadows.sm};
  position: sticky;
  top: ${HEADER_HEIGHT + 40}px;
  right: 0;
  height: 100%;
  width: ${USER_SUGGESTIONS_WIDTH}px;
  padding: ${p => p.theme.spacing.sm};
  border-radius: ${p => p.theme.radius.sm};

  @media (min-width: ${p => p.theme.screen.md}) {
    display: block;
  }
`;

const List = styled.ul`
  padding: 0;
  padding-top: ${p => p.theme.spacing.xs};
`;

const ListItem = styled.li`
  list-style-type: none;
  display: flex;
  flex-direction: row;
  margin-bottom: ${p => p.theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const ImageContainer = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FullName = styled.div`
  font-weight: ${p => p.theme.font.weight.bold};
  color: ${p =>
    p.active ? p.theme.colors.primary.main : p.theme.colors.text.primary};
`;

const UserName = styled.div`
  color: ${p => p.theme.colors.text.hint};
`;

/**
 * Displays user suggestions
 */
const UserSuggestions = () => {
  const [{ auth }] = useStore();

  return (
    <Query query={USER_SUGGESTIONS} variables={{ userId: auth.user.id }}>
      {({ data, loading }) => {
        if (loading)
          return (
            <Root>
              <Loading />
            </Root>
          );

        if (!data.suggestPeople.length > 0) {
          return null;
        }

        return (
          <Root>
            <H3>Suggestions For You</H3>

            <List>
              {data.suggestPeople.map(user => (
                <ListItem key={user.id}>
                  <A
                    to={generatePath(Routes.USER_PROFILE, {
                      username: user.username,
                    })}
                  >
                    <ImageContainer>
                      {user.image ? (
                        <Image src={user.image} alt={user.fullName} />
                      ) : (
                        <UserIcon width="30" />
                      )}
                    </ImageContainer>
                  </A>

                  <Spacing left="xs">
                    <A
                      to={generatePath(Routes.USER_PROFILE, {
                        username: user.username,
                      })}
                    >
                      <FullName>{user.fullName}</FullName>
                      <UserName>@{user.username}</UserName>
                    </A>
                  </Spacing>
                </ListItem>
              ))}
            </List>
          </Root>
        );
      }}
    </Query>
  );
};

export default UserSuggestions;
