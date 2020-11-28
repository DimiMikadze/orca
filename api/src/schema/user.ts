import { gql } from 'apollo-server-express';

export default gql`
  enum Role {
    User
    Moderator
    Admin
    SuperAdmin
  }

  type User {
    role: Role!
    id: ID!
    fullName: String!
    email: String!
    username: String!
    facebookId: String
    googleId: String
    githubId: String
    twitterId: String
    image: File
    imagePublicId: String
    coverImage: File
    coverImagePublicId: String
    isOnline: Boolean
    posts: [PostPayload]
    likes: [Like]
    comments: [Comment]
    followers: [Follow]
    following: [Follow]
    notifications: [NotificationPayload]
    createdAt: String
    updatedAt: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type SuccessMessage {
    message: String!
  }

  input UploadUserPhotoInput {
    id: ID!
    image: Upload!
    imagePublicId: String
    isCover: Boolean
  }

  type UserPayload {
    role: Role
    id: ID!
    fullName: String
    email: String
    username: String
    facebookId: String
    googleId: String
    githubId: String
    twitterId: String
    image: String
    imagePublicId: String
    coverImage: String
    coverImagePublicId: String
    isOnline: Boolean
    posts: [PostPayload]
    likes: [Like]
    followers: [Follow]
    following: [Follow]
    notifications: [NotificationPayload]
    newNotifications: [NotificationPayload]
    newConversations: [ConversationsPayload]
    unseenMessage: Boolean
    createdAt: String
    updatedAt: String
  }

  type UsersPayload {
    users: [UserPayload]!
    count: String!
  }

  type IsUserOnlinePayload {
    userId: ID!
    isOnline: Boolean
  }

  extend type Query {
    getAuthUser: UserPayload
    getUser(username: String, id: ID): UserPayload
    getUsers(userId: String!, skip: Int, limit: Int): UsersPayload
    searchUsers(searchQuery: String!): [UserPayload]
    suggestPeople(userId: String!): [UserPayload]
  }

  extend type Mutation {
    uploadUserPhoto(input: UploadUserPhotoInput!): UserPayload
  }

  extend type Subscription {
    isUserOnline(authUserId: ID!, userId: ID!): IsUserOnlinePayload
  }
`;
