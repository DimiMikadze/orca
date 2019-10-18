import { useApolloClient } from '@apollo/react-hooks';
import { CREATE_NOTIFICATION, DELETE_NOTIFICATION } from 'graphql/notification';
import { useStore } from 'store';

/**
 * React hook that Creates or Deletes a notification after like, follow or comment
 */
export const useNotifications = () => {
  const [{ auth }] = useStore();

  const client = useApolloClient();

  /**
   * Helper function for mutation
   */
  const mutate = async (mutation, variables) => {
    try {
      return await client.mutate({
        mutation,
        variables: { input: { ...variables } },
      });
    } catch (error) {
      console.error('Error while mutating a notification', error);
    }
  };

  /**
   * Creates a notification
   */
  const create = ({ user, postId, notificationType, notificationTypeId }) => {
    return mutate(CREATE_NOTIFICATION, {
      authorId: auth.user.id,
      userId: user.id,
      postId,
      notificationType,
      notificationTypeId,
    });
  };

  /**
   * Removes a notification
   */
  const remove = ({ notificationId }) =>
    mutate(DELETE_NOTIFICATION, { id: notificationId });

  /**
   * Checks if user has already a notification and based on that Creates or Deletes a notification
   */
  const toggle = ({
    user,
    postId,
    notificationType,
    notificationTypeId,
    hasDone,
  }) => {
    const type = notificationType.toLowerCase();
    const isNotified = user.notifications.find(
      n => n[type] && hasDone && n[type].id === hasDone.id
    );
    const notificationId = isNotified ? isNotified.id : null;
    const operation = notificationId ? 'delete' : 'create';
    const options = {
      create: {
        mutation: CREATE_NOTIFICATION,
        variables: {
          authorId: auth.user.id,
          userId: user.id,
          postId,
          notificationType,
          notificationTypeId,
        },
      },
      delete: {
        mutation: DELETE_NOTIFICATION,
        variables: { id: notificationId },
      },
    };

    return mutate(options[operation].mutation, options[operation].variables);
  };

  return { create, remove, toggle };
};
