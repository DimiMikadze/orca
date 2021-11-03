import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Root, UserName, Container, StyledButton } from './style';
import { Link, Avatar, Confirm } from '../../ui';
import { CloseIcon } from '../../ui/icons';
import { RootState } from '../../../store';
import { useNotifications } from '../../../utils';
import Linkify from '../../Linkify';

const deleteComment = async (id: string) => {
  const like = await axios.delete('/comments/delete', { data: { id } });
  return like.data;
};

interface CommentProps {
  comment: any;
  author: any;
  queryKey: any;
  post: any;
}

const Comment: FC<CommentProps> = ({ comment, author, queryKey, post }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { mutateAsync } = useMutation(deleteComment);
  const queryClient = useQueryClient();
  const { deleteNotification } = useNotifications();

  const remove = async () => {
    try {
      const deletedComment = await mutateAsync(comment._id);
      queryClient.setQueryData(queryKey, (existingPosts: any) => {
        if (!existingPosts.pages) {
          return {
            ...existingPosts,
            comments: existingPosts.comments.filter((comment) => comment._id !== deletedComment._id),
          };
        }

        return {
          ...existingPosts,
          pages: existingPosts.pages.map((posts) => {
            return posts.map((p) => {
              if (p._id === post._id) {
                return {
                  ...p,
                  comments: p.comments.filter((comment) => comment._id !== deletedComment._id),
                };
              } else {
                return p;
              }
            });
          }),
        };
      });
      const notification = post.author.notifications.find((n) => n?.comment?._id === deletedComment?._id);
      if (notification) {
        deleteNotification({
          id: notification._id,
          postId: post._id,
          user: post.author,
          queryKey,
        });
      }
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('An error occurred while deleting a comment: ', error);
    }
  };

  return (
    <Root>
      <Link disableBorderOnHover href={`/profile/${author._id}`}>
        <Avatar image={author?.image} />
      </Link>

      <Container>
        <UserName>
          <Link color="text" weight="bold" size="tiny" href={`/profile/${author._id}`}>
            {author.fullName}
          </Link>
        </UserName>
        <Linkify>{comment.comment}</Linkify>
      </Container>

      <Confirm
        onConfirm={remove}
        close={() => setIsConfirmOpen(false)}
        isOpen={isConfirmOpen}
        title="Remove the comment permanently?"
      />

      {authUser && authUser._id === author._id && (
        <StyledButton ghost onClick={() => setIsConfirmOpen(true)}>
          <CloseIcon width="10" />
        </StyledButton>
      )}
    </Root>
  );
};

export default Comment;
