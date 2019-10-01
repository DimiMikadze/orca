import gql from 'graphql-tag';

/**
 * Creates a notification for user
 */
export const CREATE_NOTIFICATION = gql`
  mutation($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
    }
  }
`;

/**
 * Deletes a notification
 */
export const DELETE_NOTIFICATION = gql`
  mutation($input: DeleteNotificationInput!) {
    deleteNotification(input: $input) {
      id
    }
  }
`;

/**
 * Gets notifications for user
 */
export const GET_USER_NOTIFICATION = gql`
  query($userId: ID!, $skip: Int, $limit: Int) {
    getUserNotifications(userId: $userId, skip: $skip, limit: $limit) {
      count
      notifications {
        id
        createdAt
        author {
          id
          fullName
          username
          image
        }
        follow {
          id
        }
        comment {
          id
          post {
            id
            image
          }
        }
        like {
          id
          post {
            id
            image
          }
        }
      }
    }
  }
`;

/**
 * Updates notification seen property
 */
export const UPDATE_NOTIFICATION_SEEN = gql`
  mutation($input: UpdateNotificationSeenInput!) {
    updateNotificationSeen(input: $input)
  }
`;
