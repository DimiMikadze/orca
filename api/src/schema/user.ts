import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: ID!
    fullName: String!
    email: String!
    username: String!
    password: String!
    resetToken: String
    resetTokenExpiry: String
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

  type Token {
    token: String!
  }

  type SuccessMessage {
    message: String!
  }

  input SignInInput {
    emailOrUsername: String!
    password: String
  }

  input SignUpInput {
    email: String!
    username: String!
    fullName: String!
    password: String!
  }

  input RequestPasswordResetInput {
    email: String!
  }

  input ResetPasswordInput {
    email: String!
    token: String!
    password: String!
  }

  input UploadUserPhotoInput {
    id: ID!
    image: Upload!
    imagePublicId: String
    isCover: Boolean
  }

  type UserPayload {
    id: ID!
    fullName: String
    email: String
    username: String
    password: String
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
    verifyResetPasswordToken(email: String, token: String!): SuccessMessage
    getAuthUser: UserPayload
    getUser(username: String, id: ID): UserPayload
    getUsers(userId: String!, skip: Int, limit: Int): UsersPayload
    searchUsers(searchQuery: String!): [UserPayload]
    suggestPeople(userId: String!): [UserPayload]
  }

  extend type Mutation {
    signin(input: SignInInput!): Token
    signup(input: SignUpInput!): Token
    requestPasswordReset(input: RequestPasswordResetInput!): SuccessMessage
    resetPassword(input: ResetPasswordInput!): Token
    uploadUserPhoto(input: UploadUserPhotoInput!): UserPayload
  }

  extend type Subscription {
    isUserOnline(authUserId: ID!, userId: ID!): IsUserOnlinePayload
  }
`;
