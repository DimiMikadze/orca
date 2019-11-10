import { withFilter } from 'apollo-server';

import { pubSub } from '../utils/apollo-server';
import { NOTIFICATION_CREATED_OR_DELETED } from '../constants/Subscriptions';

const Query = {
  /**
   * Gets notifications for specific user
   *
   * @param {string} userId
   * @param {int} skip how many notifications to skip
   * @param {int} limit how many notifications to limit
   */
  getUserNotifications: async (
    root,
    { userId, skip, limit },
    { Notification }
  ) => {
    const query = { user: userId };
    const count = await Notification.where(query).countDocuments();
    const notifications = await Notification.where(query)
      .populate('author')
      .populate('user')
      .populate('follow')
      .populate({ path: 'comment', populate: { path: 'post' } })
      .populate({ path: 'like', populate: { path: 'post' } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    return { notifications, count };
  },
};

const Mutation = {
  /**
   * Creates a new notification for user
   *
   * @param {string} userId
   * @param {string} authorId
   * @param {string} postId
   * @param {string} notificationType
   * @param {string} notificationTypeId
   */
  createNotification: async (
    root,
    {
      input: { userId, authorId, postId, notificationType, notificationTypeId },
    },
    { Notification, User }
  ) => {
    let newNotification = await new Notification({
      author: authorId,
      user: userId,
      post: postId,
      [notificationType.toLowerCase()]: notificationTypeId,
    }).save();

    // Push notification to user collection
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { notifications: newNotification.id } }
    );

    // Publish notification created event
    newNotification = await newNotification
      .populate('author')
      .populate('follow')
      .populate({ path: 'comment', populate: { path: 'post' } })
      .populate({ path: 'like', populate: { path: 'post' } })
      .execPopulate();
    pubSub.publish(NOTIFICATION_CREATED_OR_DELETED, {
      notificationCreatedOrDeleted: {
        operation: 'CREATE',
        notification: newNotification,
      },
    });

    return newNotification;
  },
  /**
   * Deletes a notification
   *
   * @param {string} id
   */
  deleteNotification: async (
    root,
    { input: { id } },
    { Notification, User }
  ) => {
    let notification = await Notification.findByIdAndRemove(id);

    // Delete notification from users collection
    await User.findOneAndUpdate(
      { _id: notification.user },
      { $pull: { notifications: notification.id } }
    );

    // Publish notification deleted event
    notification = await notification
      .populate('author')
      .populate('follow')
      .populate({ path: 'comment', populate: { path: 'post' } })
      .populate({ path: 'like', populate: { path: 'post' } })
      .execPopulate();
    pubSub.publish(NOTIFICATION_CREATED_OR_DELETED, {
      notificationCreatedOrDeleted: {
        operation: 'DELETE',
        notification,
      },
    });

    return notification;
  },
  /**
   * Updates notification seen values for user
   *
   * @param {string} userId
   */
  updateNotificationSeen: async (
    root,
    { input: { userId } },
    { Notification }
  ) => {
    try {
      await Notification.update(
        { user: userId, seen: false },
        { seen: true },
        { multi: true }
      );

      return true;
    } catch (e) {
      return false;
    }
  },
};

const Subscription = {
  /**
   * Subscribes to notification created or deleted event
   */
  notificationCreatedOrDeleted: {
    subscribe: withFilter(
      () => pubSub.asyncIterator(NOTIFICATION_CREATED_OR_DELETED),
      (payload, variables, { authUser }) => {
        const userId = payload.notificationCreatedOrDeleted.notification.user.toString();

        return authUser && authUser.id === userId;
      }
    ),
  },
};

export default { Query, Mutation, Subscription };
