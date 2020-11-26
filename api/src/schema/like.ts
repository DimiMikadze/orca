import { gql } from 'apollo-server-express';

export default gql`
  type Like {
    id: ID!
    post: ID
    user: ID
  }

  input CreateLikeInput {
    userId: ID!
    postId: ID!
  }

  input DeleteLikeInput {
    id: ID!
  }

  type LikePayload {
    id: ID!
    post: PostPayload
    user: UserPayload
  }

  extend type Mutation {
    createLike(input: CreateLikeInput!): Like
    deleteLike(input: DeleteLikeInput!): Like
  }
`;
