import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema that describes the main functionality of the API
 *
 * https://www.apollographql.com/docs/apollo-server/schema/schema/
 */

const schema = gql`
  # ---------------------------------------------------------
  # Model and Root Query Objects
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
    posts: [PostPayload]
    likes: [Like]
    comments: [Comment]
    followers: [Follow]
    following: [Follow]
    notifications: [NotificationPayload]
    createdAt: String
    updatedAt: String
  }

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

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Like {
    id: ID!
    post: ID
    user: ID
  }

  type Follow {
    id: ID!
    user: ID
    follower: ID
  }

  type Comment {
    id: ID!
    comment: String!
    author: ID
    post: ID
    createdAt: String
  }

  enum NotificationType {
    LIKE
    FOLLOW
    COMMENT
  }

  type Notification {
    id: ID!
    user: User
    author: User
    post: ID!
    like: Like
    follow: Follow
    comment: Comment
    type: NotificationType
    seen: Boolean
    createdAt: String
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

  input CreateLikeInput {
    userId: ID!
    postId: ID!
  }

  input DeleteLikeInput {
    id: ID!
  }

  input CreateFollowInput {
    userId: ID!
    followerId: ID!
  }

  input DeleteFollowInput {
    id: ID!
  }

  input CreateCommentInput {
    comment: String!
    author: ID!
    postId: ID!
  }

  input DeleteCommentInput {
    id: ID!
  }

  input CreateNotificationInput {
    userId: ID!
    authorId: ID!
    postId: ID
    notificationType: NotificationType!
    notificationTypeId: ID
  }

  input DeleteNotificationInput {
    id: ID!
  }

  input UpdateNotificationSeenInput {
    userId: ID!
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
    posts: [PostPayload]
    likes: [Like]
    followers: [Follow]
    following: [Follow]
    notifications: [NotificationPayload]
    newNotifications: [NotificationPayload]
    createdAt: String
    updatedAt: String
  }

  type UserPostsPayload {
    posts: [PostPayload]!
    count: String!
  }

  type UsersPayload {
    users: [UserPayload]!
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

  type LikePayload {
    id: ID!
    post: PostPayload
    user: UserPayload
  }

  type NotificationPayload {
    id: ID
    user: UserPayload
    author: UserPayload
    like: LikePayload
    follow: Follow
    comment: CommentPayload
    createdAt: String
  }

  type NotificationsPayload {
    count: String!
    notifications: [NotificationPayload]!
  }

  type CommentPayload {
    id: ID
    comment: String
    author: UserPayload
    post: PostPayload
    createdAt: String
  }

  # ---------------------------------------------------------
  # Query Root
  # ---------------------------------------------------------
  type Query {
    # Verifies reset password token
    verifyResetPasswordToken(email: String, token: String!): SuccessMessage

    # Gets the currently logged in user
    getAuthUser: UserPayload

    # Gets user by username
    getUser(username: String!): UserPayload

    # Gets user posts by username
    getUserPosts(username: String!, skip: Int, limit: Int): UserPostsPayload

    # Gets all users
    getUsers(userId: String!, skip: Int, limit: Int): UsersPayload

    # Searches users by username or fullName
    searchUsers(searchQuery: String!): [UserPayload]

    # Gets Suggested people for user
    suggestPeople(userId: String!): [UserPayload]

    # Gets posts from followed users
    getFollowedPosts(userId: String!, skip: Int, limit: Int): PostsPayload

    # Gets all posts
    getPosts(authUserId: ID!, skip: Int, limit: Int): PostsPayload

    # Gets post by id
    getPost(id: ID!): PostPayload

    # Gets notifications for specific user
    getUserNotifications(
      userId: ID
      skip: Int
      limit: Int
    ): NotificationsPayload
  }

  # ---------------------------------------------------------
  # Mutation Root
  # ---------------------------------------------------------
  type Mutation {
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

    # Creates a new post
    createPost(input: CreatePostInput!): PostPayload

    # Deletes a user post
    deletePost(input: DeletePostInput!): PostPayload

    # Creates a like for post
    createLike(input: CreateLikeInput!): Like

    # Deletes a post like
    deleteLike(input: DeleteLikeInput!): Like

    # Creates a following/follower relationship between users
    createFollow(input: CreateFollowInput!): Follow

    # Deletes a following/follower relationship between users
    deleteFollow(input: DeleteFollowInput!): Follow

    # Creates a post comment
    createComment(input: CreateCommentInput!): Comment

    # Deletes a post comment
    deleteComment(input: DeleteCommentInput!): Comment

    # Creates a new notification for user
    createNotification(input: CreateNotificationInput!): Notification

    # Deletes a notification
    deleteNotification(input: DeleteNotificationInput!): Notification

    # Updates notification seen values for user
    updateNotificationSeen(input: UpdateNotificationSeenInput!): Boolean
  }
`;

export default schema;
