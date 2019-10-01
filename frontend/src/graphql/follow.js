import gql from 'graphql-tag';

/**
 * Creates a following between two users
 */
export const CREATE_FOLLOW = gql`
  mutation($input: CreateFollowInput!) {
    createFollow(input: $input) {
      id
    }
  }
`;

/**
 * deletes a following
 */
export const DELETE_FOLLOW = gql`
  mutation($input: DeleteFollowInput!) {
    deleteFollow(input: $input) {
      id
    }
  }
`;
