import gql from "graphql-tag";

/**
 * Creates a like
 */
export const CREATE_LIKE = gql`
  mutation($input: CreateLikeInput!) {
    createLike(input: $input) {
      id
    }
  }
`;

/**
 * Deletes a like
 */
export const DELETE_LIKE = gql`
  mutation($input: DeleteLikeInput!) {
    deleteLike(input: $input) {
      id
    }
  }
`;
