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
 * Gets user's specific conversation in real time
 */
export const GET_MESSAGES_SUBSCRIPTION = gql`
  subscription($authUserId: ID!, $userId: ID!) {
    messageCreated(authUserId: $authUserId, userId: $userId) {
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
      isFirstMessage
    }
  }
`;
