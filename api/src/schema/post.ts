import { gql } from 'apollo-server-express';

export default gql`
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

  type PostPayload {
    id: ID
    title: String
    image: String
    imagePublicId: String
    author: UserPayload
    likes: [Like]
    comments: [CommentPayload]
    createdAt: String
    updatedAt: String
  }

  type PostsPayload {
    posts: [PostPayload]
    count: String
  }

  extend type Query {
    getFollowedPosts(userId: String!, skip: Int, limit: Int): PostsPayload
    getPosts(authUserId: ID!, skip: Int, limit: Int): PostsPayload
    getPost(id: ID!): PostPayload
  }

  extend type Mutation {
    createPost(input: CreatePostInput!): PostPayload
    deletePost(input: DeletePostInput!): PostPayload
  }
`;
