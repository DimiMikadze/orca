import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';

import Skeleton from 'components/Skeleton';
import { Container, Spacing } from 'components/Layout';
import ProfileInfo from './ProfileInfo';
import CreatePost from 'components/CreatePost';
import ProfilePosts from './ProfilePosts';
import NotFound from 'components/NotFound';
import Head from 'components/Head';

import { GET_USER } from 'graphql/user';

import { useStore } from 'store';

const Root = styled.div`
  width: 100%;

  @media (min-width: ${(p) => p.theme.screen.lg}) {
    margin-left: ${(p) => p.theme.spacing.lg};
    padding: 0;
  }
`;

/**
 * User Profile Page
 */
const Profile = ({ match }) => {
  const [{ auth }] = useStore();
  const { username } = match.params;
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { username },
  });

  const renderContent = () => {
    if (loading) {
      return (
        <Container padding="xxs">
          <Skeleton height={350} />
          <Container maxWidth="sm">
            <Spacing top="lg" bottom="lg">
              <Skeleton height={82} />
            </Spacing>
          </Container>
        </Container>
      );
    }

    if (error || !data.getUser) return <NotFound />;

    return (
      <Container padding="xxs">
        <ProfileInfo user={data.getUser} />

        <Container maxWidth="sm">
          <Spacing top="lg" bottom="lg">
            {username === auth.user.username && <CreatePost />}
          </Spacing>

          <ProfilePosts username={username} />
        </Container>
      </Container>
    );
  };

  return (
    <Root>
      <Head title={username} />

      {renderContent()}
    </Root>
  );
};

Profile.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Profile);
