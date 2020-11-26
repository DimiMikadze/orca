import { gql } from 'apollo-server-express';

export default gql`
  type Follow {
    id: ID!
    user: ID
    follower: ID
  }

  input CreateFollowInput {
    userId: ID!
    followerId: ID!
  }

  input DeleteFollowInput {
    id: ID!
  }

  extend type Mutation {
    createFollow(input: CreateFollowInput!): Follow
    deleteFollow(input: DeleteFollowInput!): Follow
  }
`;
