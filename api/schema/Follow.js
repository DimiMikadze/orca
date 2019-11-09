import { gql } from 'apollo-server-express';

/**
 * Follow schema
 */
const FollowSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Follow {
    id: ID!
    user: ID
    follower: ID
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateFollowInput {
    userId: ID!
    followerId: ID!
  }

  input DeleteFollowInput {
    id: ID!
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a following/follower relationship between users
    createFollow(input: CreateFollowInput!): Follow

    # Deletes a following/follower relationship between users
    deleteFollow(input: DeleteFollowInput!): Follow
  }
`;

export default FollowSchema;
