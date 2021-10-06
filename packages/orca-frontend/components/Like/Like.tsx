import React, { FC } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import debounce from 'lodash/debounce';
import { openAuthPopup, PopupType } from '../../store/auth';
import { LikeIcon } from '../ui/icons';
import Spacing from '../ui/Spacing';
import { RootState } from '../../store';
import { useNotifications } from '../../utils';
import { NotificationType } from '../../constants/Notification';
import { Button } from '../ui/Button';

const createLike = async ({ postId }) => {
  const like = await axios.post('/likes/create', { postId });
  return like.data;
};

const deleteLike = async (id: string) => {
  const like = await axios.delete('/likes/delete', { data: { id } });
  return like.data;
};

interface LikeProps {
  withText?: boolean;
  fullWidth?: boolean;
  post: any;
  hasLiked: any;
  queryKey: any;
}

const StyledButton = styled(Button)`
  padding: ${(p) => p.theme.spacing.xs};
`;

const Like: FC<LikeProps> = ({ withText, fullWidth, hasLiked, post, queryKey }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const color = hasLiked ? 'primary' : 'textSecondary';
  const queryClient = useQueryClient();
  const { createNotification, deleteNotification } = useNotifications();

  const { mutateAsync: createLikeMutation } = useMutation(createLike);
  const { mutateAsync: deleteLikeMutation } = useMutation(deleteLike);

  const updateAfterLike = (like) => {
    queryClient.setQueryData(queryKey, (existingPosts: any) => {
      if (!existingPosts.pages) {
        return {
          ...existingPosts,
          likes: [like, ...existingPosts.likes],
        };
      }

      return {
        ...existingPosts,
        pages: existingPosts.pages.map((posts) => {
          return posts.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                likes: [like, ...p.likes],
              };
            } else {
              return p;
            }
          });
        }),
      };
    });
  };

  const updateAfterUnLike = (likeId) => {
    queryClient.setQueryData(queryKey, (existingPosts: any) => {
      if (!existingPosts.pages) {
        return {
          ...existingPosts,
          likes: existingPosts.likes.filter((like) => like._id !== likeId),
        };
      }

      return {
        ...existingPosts,
        pages: existingPosts.pages.map((posts) => {
          return posts.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                likes: p.likes.filter((like) => like._id !== likeId),
              };
            } else {
              return p;
            }
          });
        }),
      };
    });
  };

  const likeMutation = async () => {
    try {
      const like = hasLiked ? await deleteLikeMutation(hasLiked?._id) : await createLikeMutation({ postId: post._id });
      hasLiked ? updateAfterUnLike(like._id) : updateAfterLike(like);

      if (hasLiked) {
        const notification = post.author.notifications.find((n) => n?.like?._id === hasLiked?._id);
        if (notification) {
          deleteNotification({ id: notification._id, postId: post._id, user: post.author, queryKey });
        }
      } else {
        createNotification({
          user: post.author,
          postId: post._id,
          notificationType: NotificationType.LIKE,
          notificationTypeId: like._id,
          queryKey,
        });
      }
    } catch (error) {
      console.error('Error while trying to crate or delete a like', error);
    }
  };

  const openAuthModal = () => {
    dispatch(openAuthPopup(PopupType.Sign_Up));
  };

  return (
    <StyledButton
      onClick={debounce(authUser ? likeMutation : openAuthModal, 200)}
      fullWidth={fullWidth}
      radius="none"
      text
      size="xs"
      weight="bold"
      color={color}
    >
      <LikeIcon color={color} />
      {withText && <Spacing left="xxs">Like</Spacing>}
    </StyledButton>
  );
};

export default Like;
