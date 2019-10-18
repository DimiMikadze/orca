import gql from 'graphql-tag';

/**
 * Gets user's specific conversation
 */
export const GET_MESSAGES = gql`
  query($authUserId: ID!, $userId: ID!) {
    getMessages(authUserId: $authUserId, userId: $userId) {
      id
      receiver {
        id
        username
        fullName
        image
        createdAt
      }
      sender {
        id
        username
        fullName
        image
        createdAt
      }
      message
      createdAt
    }
  }
`;

/**
 * Creates a message
 */
export const CREATE_MESSAGE = gql`
  mutation($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
    }
  }
`;

/**
 * Deletes a message
 */
export const DELETE_MESSAGE = gql`
  mutation($input: DeleteMessageInput!) {
    deleteMessage(input: $input) {
      id
    }
  }
`;
