import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';

import { LikeIcon } from 'components/icons';
import { Spacing } from './Layout';
import { Button } from './Form';

import { GET_FOLLOWED_POSTS, GET_POSTS } from 'graphql/post';
import { GET_AUTH_USER } from 'graphql/user';
import { CREATE_LIKE, DELETE_LIKE } from 'graphql/like';

import { NotificationType } from 'constants/NotificationType';

import { useNotifications } from 'hooks/useNotifications';

import { useStore } from 'store';

const StyledButton = styled(Button)`
  padding: ${p => p.theme.spacing.xs} 0;
`;

/**
 * Component for rendering Like button
 */
const Like = ({ postId, user, likes, withText, fullWidth }) => {
  const [loading, setLoading] = useState(false);

  const [{ auth }] = useStore();

  const notification = useNotifications();

  const hasLiked = likes.find(
    l => l.user === auth.user.id && l.post === postId
  );

  const handleButtonClick = async mutate => {
    setLoading(true);
    const { data } = await mutate();

    // Create or delete notification for like
    if (auth.user.id === user.id) return setLoading(false);
    await notification.toggle({
      user,
      postId,
      hasDone: hasLiked,
      notificationType: NotificationType.LIKE,
      notificationTypeId: data.createLike ? data.createLike.id : null,
    });
    setLoading(false);
  };

  // Detect which mutation to use
  const operation = hasLiked ? 'delete' : 'create';
  const options = {
    create: {
      mutation: CREATE_LIKE,
      variables: { postId, userId: auth.user.id },
    },
    delete: {
      mutation: DELETE_LIKE,
      variables: { id: hasLiked ? hasLiked.id : null },
    },
  };

  return (
    <Mutation
      mutation={options[operation].mutation}
      variables={{ input: { ...options[operation].variables } }}
      refetchQueries={() => [
        { query: GET_AUTH_USER },
        { query: GET_POSTS, variables: { authUserId: auth.user.id } },
        { query: GET_FOLLOWED_POSTS, variables: { userId: auth.user.id } },
      ]}
    >
      {mutate => {
        return (
          <StyledButton
            fullWidth={fullWidth && fullWidth}
            disabled={loading}
            text
            onClick={() => handleButtonClick(mutate)}
            color={hasLiked && 'primary.main'}
          >
            <LikeIcon color={hasLiked && 'primary.main'} />
            <Spacing inline left="xxs" />
            {withText && <b>Like</b>}
          </StyledButton>
        );
      }}
    </Mutation>
  );
};

Like.propTypes = {
  postId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  likes: PropTypes.array,
  withText: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default Like;
