// @ts-nocheck
import Notification from '../models/notification';
import { NotificationType } from '../constants';
import User from '../models/user';

export const notificationById = async (id: string): Promise<any> => {
  const notification = await Notification.findById(id);
  return notification;
};

export const notificationByAuthorUserAndType = async (
  userId: string,
  authorId: string,
  notificationType: string,
  postId?: string
): Promise<any> => {
  const query = {
    author: authorId,
    user: userId,
    [notificationType.toLowerCase()]: { $ne: null },
    seen: false,
  };
  if (postId) {
    query.post = postId;
  }
  const notification = await Notification.findOne(query);
  return notification;
};

export const notificationByAuthorAndUserId = async (authorId: string, userId: string): Promise<any> => {
  const notification = await Notification.findOne({
    author: authorId,
    user: userId,
    seen: false,
    message: { $exists: true, $ne: null },
  });
  return notification;
};

export const getUserNotifications = async (userId: any, offset: number, limit: number): Promise<any> => {
  const notifications: any = await Notification.find({ user: userId })
    .populate('author', '-password')
    .populate('user', '-password')
    .populate('follow')
    .populate({ path: 'comment', populate: { path: 'post' } })
    .populate({ path: 'like', populate: { path: 'post' } })
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: 'desc' });
  return notifications;
};

export const createNotification = async (
  userId: string,
  authorId: string,
  postId: string,
  notificationType: NotificationType,
  notificationTypeId: string
): Promise<any> => {
  let newNotification = await new Notification({
    author: authorId,
    user: userId,
    post: postId,
    [notificationType.toLowerCase()]: notificationTypeId,
  }).save();

  // Push the notification to the user collection.
  await User.findOneAndUpdate({ _id: userId }, { $push: { notifications: newNotification._id } });

  newNotification = await newNotification
    .populate('author')
    .populate('follow')
    .populate({ path: 'comment', populate: { path: 'post' } })
    .populate({ path: 'like', populate: { path: 'post' } })
    .execPopulate();

  return newNotification;
};

export const deleteNotification = async (id: string): Promise<any> => {
  let notification = await Notification.findByIdAndRemove(id);

  // Delete the notification from the user's collection.
  await User.findOneAndUpdate({ _id: notification.user }, { $pull: { notifications: notification._id } });

  notification = await notification
    .populate('author')
    .populate('follow')
    .populate({ path: 'comment', populate: { path: 'post' } })
    .populate({ path: 'like', populate: { path: 'post' } })
    .execPopulate();

  return notification;
};

export const updateNotificationSeen = async (userId: string): Promise<any> => {
  const notifications = await Notification.updateMany({ user: userId, seen: false }, { seen: true }, { multi: true });
  return notifications;
};

export const updateMessagesNotificationSeen = async (authUserId: string, userId: string): Promise<any> => {
  const notifications = await Notification.updateMany(
    { author: userId, user: authUserId, seen: false, message: { $exists: true, $ne: null } },
    { seen: true },
    { multi: true }
  );
  return notifications;
};
