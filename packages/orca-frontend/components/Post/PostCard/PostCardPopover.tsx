import React, { FC, useState, useRef } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { Button, Confirm } from '../../ui';
import { ThreeDotsIcon } from '../../ui/icons';
import { useClickOutside } from '../../../utils';
import { Popover, PopoverContent } from './style';
import { openAlert, AlertTypes } from '../../../store/alert';
import { useRouter } from 'next/router';

interface PostCardPopoverProps {
  postId: string;
  channelId: string;
  queryKey: any;
  imagePublicId: string;
  openPostCreate: () => void;
}

const deletePost = async ({ id: id, imagePublicId: imagePublicId }) => {
  const newPost = await axios.delete('/posts/delete', { data: { id, imagePublicId } });
  return newPost.data;
};

const PostCardPopover: FC<PostCardPopoverProps> = ({ postId, queryKey, imagePublicId, openPostCreate }) => {
  const router = useRouter();
  const ref = useRef(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  useClickOutside(ref, isPopoverOpen, () => {
    setIsPopoverOpen(false);
  });

  const { mutateAsync } = useMutation(deletePost);

  const removePost = async () => {
    try {
      const deletedPost = await mutateAsync({ id: postId, imagePublicId });
      // If a user deletes a post on which page they are on, we'll redirect them to the home page.
      // Hence, we don't need to update the cache.
      if (router.route !== '/post/[id]') {
        queryClient.setQueryData(queryKey, (existingPosts: any) => {
          return {
            ...existingPosts,
            pages: existingPosts.pages.map((posts) => posts.filter((post) => post._id !== deletedPost._id)),
          };
        });
      }

      setIsConfirmOpen(false);
      dispatch(
        openAlert({
          message: 'The post has been successfully deleted.',
          type: AlertTypes.Success,
        })
      );
      if (router.route === '/post/[id]') {
        router.push('/');
      }
    } catch (error) {
      console.log('An error occurred while deleting a post: ', error);
      dispatch(
        openAlert({
          message: 'An error occurred while deleting a post.',
          type: AlertTypes.Error,
        })
      );
    }
  };

  const onOpenConfirm = () => {
    setIsConfirmOpen(true);
    setIsPopoverOpen(false);
  };

  return (
    <Popover ref={ref}>
      <Confirm
        isOpen={isConfirmOpen}
        close={() => setIsConfirmOpen(false)}
        onConfirm={removePost}
        title="Delete the post permanently?"
      />

      <Button ghost onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
        <ThreeDotsIcon width="16" />
      </Button>

      {isPopoverOpen && (
        <PopoverContent>
          <Button text fullWidth radius="none" size="xs" onClick={openPostCreate}>
            Edit
          </Button>
          <Button text fullWidth radius="none" size="xs" onClick={onOpenConfirm}>
            Delete
          </Button>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default PostCardPopover;
