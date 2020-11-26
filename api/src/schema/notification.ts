import { gql } from 'apollo-server-express';

export default gql`
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

  extend type Query {
    getUserNotifications(userId: ID!, skip: Int, limit: Int): NotificationsPayload
  }

  extend type Mutation {
    createNotification(input: CreateNotificationInput!): Notification
    deleteNotification(input: DeleteNotificationInput!): Notification
    updateNotificationSeen(input: UpdateNotificationSeenInput!): Boolean
  }

  extend type Subscription {
    notificationCreatedOrDeleted: NotificationCreatedOrDeletedPayload
  }
`;
