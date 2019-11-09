import { gql } from 'apollo-server-express';

/**
 * Post schema
 */
const PostSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Post {
    id: ID!
    title: String
    image: File
    imagePublicId: String
    author: User!
    likes: [Like]
    comments: [Comment]
    createdAt: String
    updatedAt: String
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreatePostInput {
    title: String
    image: Upload
    imagePublicId: String
    authorId: ID!
  }

  input DeletePostInput {
    id: ID!
    imagePublicId: String
  }

  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type UserPostsPayload {
    posts: [PostPayload]!
    count: String!
  }

  type PostPayload {
    id: ID!
    title: String
    image: String
    imagePublicId: String
    author: UserPayload!
    likes: [Like]
    comments: [CommentPayload]
    createdAt: String
    updatedAt: String
  }

  type PostsPayload {
    posts: [PostPayload]!
    count: String!
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets user posts by username
    getUserPosts(username: String!, skip: Int, limit: Int): UserPostsPayload

    # Gets posts from followed users
    getFollowedPosts(userId: String!, skip: Int, limit: Int): PostsPayload

    # Gets all posts
    getPosts(authUserId: ID!, skip: Int, limit: Int): PostsPayload

    # Gets post by id
    getPost(id: ID!): PostPayload
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new post
    createPost(input: CreatePostInput!): PostPayload

    # Deletes a user post
    deletePost(input: DeletePostInput!): PostPayload
  }
`;

export default PostSchema;
