import React, { FC, FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Root, TextareaContainer } from './style';
import { Avatar, TextAreaAutoSize } from '../../ui';
import axios from 'axios';
import { useNotifications } from '../../../utils';
import { NotificationType } from '../../../constants/Notification';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const createComment = async ({ comment, postId }) => {
  const newComment = await axios.post('/comments/create', { comment, postId });
  return newComment.data;
};

interface CommentCreateProps {
  autoFocus?: boolean;
  post: any;
  queryKey: any;
}

const CommentCreate: FC<CommentCreateProps> = ({ autoFocus, post, queryKey }) => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [comment, setComment] = useState('');
  const { mutateAsync } = useMutation(createComment);
  const queryClient = useQueryClient();
  const { createNotification } = useNotifications();

  const handleChange = (e: FormEvent) => {
    const { value } = e.target as HTMLInputElement;
    setComment(value);
  };

  const onEnterPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (!comment.trim()) {
        return;
      }

      try {
        const newComment = await mutateAsync({ comment, postId: post._id });

        queryClient.setQueryData(queryKey, (existingPosts: any) => {
          if (!existingPosts.pages) {
            return {
              ...existingPosts,
              comments: [...existingPosts.comments, newComment],
            };
          }

          return {
            ...existingPosts,
            pages: existingPosts.pages.map((posts) => {
              return posts.map((p) => {
                if (p._id === post._id) {
                  return {
                    ...p,
                    comments: [...p.comments, newComment],
                  };
                } else {
                  return p;
                }
              });
            }),
          };
        });
        createNotification({
          user: post.author,
          postId: post._id,
          notificationType: NotificationType.COMMENT,
          notificationTypeId: newComment._id,
          queryKey,
        });
        setComment('');
      } catch (error) {
        console.error('An error occurred while creating a comment: ', error);
      }
    }
  };

  return (
    <Root>
      <Avatar image={authUser?.image} />

      <TextareaContainer>
        <TextAreaAutoSize
          onKeyDown={onEnterPress}
          rowLength={1}
          backgroundColorTone={10}
          onChange={handleChange}
          autoFocus={autoFocus}
          value={comment}
          placeholder="Write a comment..."
        />
      </TextareaContainer>
    </Root>
  );
};

export default CommentCreate;
