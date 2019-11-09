import { gql } from 'apollo-server-express';

/**
 * User schema
 */
const UserSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
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

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
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

  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
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

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Verifies reset password token
    verifyResetPasswordToken(email: String, token: String!): SuccessMessage

    # Gets the currently logged in user
    getAuthUser: UserPayload

    # Gets user by username or by id
    getUser(username: String, id: ID): UserPayload

    # Gets all users
    getUsers(userId: String!, skip: Int, limit: Int): UsersPayload

    # Searches users by username or fullName
    searchUsers(searchQuery: String!): [UserPayload]

    # Gets Suggested people for user
    suggestPeople(userId: String!): [UserPayload]
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Signs in user
    signin(input: SignInInput!): Token

    # Signs up user
    signup(input: SignUpInput!): Token

    # Requests reset password
    requestPasswordReset(input: RequestPasswordResetInput!): SuccessMessage

    # Resets user password
    resetPassword(input: ResetPasswordInput!): Token

    # Uploads user Profile or Cover photo
    uploadUserPhoto(input: UploadUserPhotoInput!): UserPayload
  }

  # ---------------------------------------------------------
  # Subscriptions
  # ---------------------------------------------------------
  extend type Subscription {
    # Subscribes to is user online event
    isUserOnline(authUserId: ID!, userId: ID!): IsUserOnlinePayload
  }
`;

export default UserSchema;
