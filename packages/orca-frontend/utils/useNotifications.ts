import axios from 'axios';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import { RootState } from '../store';
import { Events } from '../constants';
import useSocket from './useSocket';

const notificationCreate = async ({ userId, postId, notificationType, notificationTypeId }) => {
  const { data } = await axios.post('/notifications/create', {
    userId,
    postId,
    notificationType,
    notificationTypeId,
  });
  return data;
};

const notificationDelete = async (id: string) => {
  const { data } = await axios.delete('/notifications/delete', { data: { id } });
  return data;
};

const useNotifications = () => {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { mutateAsync: createMutation } = useMutation(notificationCreate);
  const { mutateAsync: deleteMutation } = useMutation(notificationDelete);
  const queryClient = useQueryClient();
  const socket = useSocket();

  const createNotification = async ({
    user,
    postId,
    notificationType,
    notificationTypeId,
    queryKey,
    disableCacheUpdate = false,
  }) => {
    if (user._id === authUser._id) {
      return;
    }

    try {
      const notification = await createMutation({
        userId: user._id,
        postId,
        notificationType,
        notificationTypeId,
      });
      socket.emit(Events.CREATE_NOTIFICATION, notification);

      if (disableCacheUpdate) {
        return;
      }

      queryClient.setQueryData(queryKey, (existingPosts: any) => {
        if (!existingPosts.pages) {
          return {
            ...existingPosts,
            notifications: [notification, ...existingPosts.notifications],
          };
        }

        return {
          ...existingPosts,
          pages: existingPosts.pages.map((posts) => {
            return posts.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  author: {
                    ...post.author,
                    notifications: [notification, ...post.author.notifications],
                  },
                };
              } else {
                return post;
              }
            });
          }),
        };
      });
    } catch (error) {
      console.error('An error occurred while creating a notification: ', error);
    }
  };

  const deleteNotification = async ({ id, postId, user, queryKey }) => {
    if (user._id === authUser._id) {
      return;
    }

    try {
      const notification = await deleteMutation(id);
      socket.emit(Events.DELETE_NOTIFICATION, notification);
      queryClient.setQueryData(queryKey, (existingPosts: any) => {
        if (!existingPosts.pages) {
          return {
            ...existingPosts,
            notifications: existingPosts.notifications.filter((n) => n._id !== notification._id),
          };
        }

        return {
          ...existingPosts,
          pages: existingPosts.pages.map((posts) => {
            return posts.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  author: {
                    ...post.author,
                    notifications: post.author.notifications.filter((n) => n._id !== notification._id),
                  },
                };
              } else {
                return post;
              }
            });
          }),
        };
      });
    } catch (error) {
      console.error('An error occurred while deleting a notification: ', error);
    }
  };

  return { createNotification, deleteNotification };
};

export default useNotifications;
