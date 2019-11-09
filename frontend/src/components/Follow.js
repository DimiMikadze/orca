import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';

import { GET_FOLLOWED_POSTS, GET_POSTS } from 'graphql/post';
import { GET_AUTH_USER, GET_USER } from 'graphql/user';
import { CREATE_FOLLOW, DELETE_FOLLOW } from 'graphql/follow';

import { NotificationType } from 'constants/NotificationType';
import { HOME_PAGE_POSTS_LIMIT } from 'constants/DataLimit';

import { useStore } from 'store';

import { useNotifications } from 'hooks/useNotifications';

const Button = styled.button`
  height: 27px;
  cursor: pointer;
  outline: none;
  font-size: ${p => p.theme.font.size.xxs};
  font-weight: ${p => p.theme.font.weight.bold};
  transition: background-color 0.2s, border-color 0.1s;
  border-radius: ${p => p.theme.radius.sm};
  color: ${p => !p.isFollowing && p.theme.colors.white};
  padding: ${p => p.theme.spacing.xxs} ${p => p.theme.spacing.xs};
  border: ${p =>
    p.isFollowing ? `1px solid ${p.theme.colors.border.main}` : '0'};
  background-color: ${p =>
    p.isFollowing ? 'transparent' : p.theme.colors.primary.main};

  &:hover {
    border-color: ${p => p.theme.colors.border.dark};
  }
`;

/**
 * Component for rendering follow button
 */
const Follow = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [{ auth }] = useStore();
  const notification = useNotifications();
  const isFollowing = auth.user.following.find(f => f.user === user.id);

  const handleClickFollow = async mutate => {
    setLoading(true);
    const { data } = await mutate();

    // Create or Delete mutation for follow
    if (auth.user.id === user.id) return setLoading(false);
    await notification.toggle({
      user,
      hasDone: isFollowing,
      notificationType: NotificationType.FOLLOW,
      notificationTypeId: data.createFollow ? data.createFollow.id : null,
    });
    setLoading(false);
  };

  // Detect which mutation to use
  const operation = isFollowing ? 'delete' : 'create';
  const options = {
    create: {
      mutation: CREATE_FOLLOW,
      variables: { userId: user.id, followerId: auth.user.id },
    },
    delete: {
      mutation: DELETE_FOLLOW,
      variables: { id: isFollowing ? isFollowing.id : null },
    },
  };

  return (
    <Mutation
      mutation={options[operation].mutation}
      variables={{ input: { ...options[operation].variables } }}
      refetchQueries={() => [
        { query: GET_AUTH_USER },
        { query: GET_POSTS, variables: { authUserId: auth.user.id } },
        {
          query: GET_FOLLOWED_POSTS,
          variables: {
            userId: auth.user.id,
            skip: 0,
            limit: HOME_PAGE_POSTS_LIMIT,
          },
        },
        { query: GET_USER, variables: { username: user.username } },
      ]}
    >
      {mutate => {
        return (
          <Button
            onClick={() => handleClickFollow(mutate)}
            disabled={loading}
            isFollowing={isFollowing}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        );
      }}
    </Mutation>
  );
};

Follow.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Follow;
