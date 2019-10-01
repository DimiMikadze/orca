import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import Skeleton from 'components/Skeleton';
import { Container, Spacing } from 'components/Layout';
import ProfileInfo from './ProfileInfo';
import CreatePost from 'components/CreatePost';
import ProfilePosts from './ProfilePosts';
import NotFound from 'components/NotFound';
import Head from 'components/Head';

import { GET_USER } from 'graphql/user';

import { useStore } from 'store';

/**
 * User Profile Page
 */
const Profile = ({ match }) => {
  const [{ auth }] = useStore();
  const { username } = match.params;

  return (
    <>
      <Head title={username} />

      <Query query={GET_USER} variables={{ username }}>
        {({ data, loading, error }) => {
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
        }}
      </Query>
    </>
  );
};

Profile.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Profile);
