import gql from "graphql-tag";

/**
 * Creates a comment
 */
export const CREATE_COMMENT = gql`
  mutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
    }
  }
`;

/**
 * Deletes a comment
 */
export const DELETE_COMMENT = gql`
  mutation($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      id
    }
  }
`;
