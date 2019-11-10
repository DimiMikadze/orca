import { gql } from 'apollo-server-express';

/**
 * Notification schema
 */
const NotificationSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
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

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
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

  enum NotificationOperationType {
    CREATE
    DELETE
  }

  type NotificationCreatedOrDeletedPayload {
    operation: NotificationOperationType!
    notification: NotificationPayload
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets notifications for specific user
    getUserNotifications(
      userId: ID!
      skip: Int
      limit: Int
    ): NotificationsPayload
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new notification for user
    createNotification(input: CreateNotificationInput!): Notification

    # Deletes a notification
    deleteNotification(input: DeleteNotificationInput!): Notification

    # Updates notification seen values for user
    updateNotificationSeen(input: UpdateNotificationSeenInput!): Boolean
  }

  # ---------------------------------------------------------
  # Subscriptions
  # ---------------------------------------------------------
  extend type Subscription {
    # Subscribes to notification created or deleted event
    notificationCreatedOrDeleted: NotificationCreatedOrDeletedPayload
  }
`;

export default NotificationSchema;
