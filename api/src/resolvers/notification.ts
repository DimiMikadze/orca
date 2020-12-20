import { withFilter } from 'apollo-server';

import { pubSub } from '../apollo-server';
import { Subscriptions } from '../constants/Subscriptions';
import { Resolvers } from '../generated-graphql';

const NotificationResolver: Resolvers = {
  Query: {
    getUserNotifications: async (root, { userId, skip, limit }, { Notification }) => {
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
  },
  Mutation: {
    createNotification: async (
      root,
      { input: { userId, authorId, postId, notificationType, notificationTypeId } },
      { Notification, User }
    ) => {
      let newNotification = await new Notification({
        author: authorId,
        user: userId,
        post: postId,
        [notificationType.toLowerCase()]: notificationTypeId,
      }).save();

      // Push notification to user collection
      await User.findOneAndUpdate({ _id: userId }, { $push: { notifications: newNotification.id } });

      newNotification = await newNotification
        .populate('author')
        .populate('follow')
        .populate({ path: 'comment', populate: { path: 'post' } })
        .populate({ path: 'like', populate: { path: 'post' } })
        .execPopulate();
      pubSub.publish(Subscriptions.Notification_Created_Or_Deleted, {
        notificationCreatedOrDeleted: {
          operation: 'CREATE',
          notification: newNotification,
        },
      });

      return newNotification;
    },
    deleteNotification: async (root, { input: { id } }, { Notification, User }) => {
      let notification = await Notification.findByIdAndRemove(id);

      // Delete notification from users collection
      await User.findOneAndUpdate({ _id: notification.user }, { $pull: { notifications: notification.id } });

      notification = await notification
        .populate('author')
        .populate('follow')
        .populate({ path: 'comment', populate: { path: 'post' } })
        .populate({ path: 'like', populate: { path: 'post' } })
        .execPopulate();
      pubSub.publish(Subscriptions.Notification_Created_Or_Deleted, {
        notificationCreatedOrDeleted: {
          operation: 'DELETE',
          notification,
        },
      });

      return notification;
    },
    updateNotificationSeen: async (root, { input: { userId } }, { Notification }) => {
      try {
        await Notification.update({ user: userId, seen: false }, { seen: true }, { multi: true });

        return true;
      } catch (e) {
        return false;
      }
    },
  },

  Subscription: {
    notificationCreatedOrDeleted: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(Subscriptions.Notification_Created_Or_Deleted),
        (payload, variables, { authUserId }) => {
          const userId = payload.notificationCreatedOrDeleted.notification.user.toString();

          return authUserId && authUserId === userId;
        }
      ),
    },
  },
};

export default NotificationResolver;
