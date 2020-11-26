import { gql } from 'apollo-server-express';

export default gql`
  type Comment {
    id: ID!
    comment: String!
    author: ID
    post: ID
    createdAt: String
  }

  input CreateCommentInput {
    comment: String!
    author: ID!
    postId: ID!
  }

  input DeleteCommentInput {
    id: ID!
  }

  type CommentPayload {
    id: ID
    comment: String
    author: UserPayload
    post: PostPayload
    createdAt: String
  }

  extend type Mutation {
    createComment(input: CreateCommentInput!): Comment
    deleteComment(input: DeleteCommentInput!): Comment
  }
`;
