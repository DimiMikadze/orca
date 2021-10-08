import { Request, Response } from 'express';
import { AuthUser, ErrorCodes } from '../constants';
import {
  getUserNotifications,
  createNotification,
  deleteNotification,
  updateNotificationSeen,
  notificationById,
  notificationByAuthorAndUserId,
  updateMessagesNotificationSeen,
} from '../db';
import { sendNotificationEmail } from '../utils/notificationEmails';

const NotificationController = {
  notificationsByUserId: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const { offset, limit } = req.query;
    const notifications = await getUserNotifications(authUser._id, +offset, +limit);
    return res.send(notifications);
  },
  notificationByAuthorAndUserId: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const { userId } = req.params;
    const notification = await notificationByAuthorAndUserId(authUser._id, userId);
    return res.send(notification);
  },
  create: async (req: Request, res: Response): Promise<any> => {
    const { userId, postId, notificationType, notificationTypeId } = req.body;
    const authUser = req.user as AuthUser;

    await sendNotificationEmail({
      userId,
      authorId: authUser._id,
      authorFullName: authUser.fullName,
      notificationType,
      postId,
      appUrl: req.headers.origin,
    });

    const notification: any = await createNotification(
      userId,
      authUser._id,
      postId,
      notificationType,
      notificationTypeId
    );

    return res.send(notification);
  },
  delete: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    const authUser = req.user as AuthUser;

    // Check if the notification author is removing the notification.
    const notification: any = await notificationById(id);
    if (notification.author.toString() === authUser._id.toString()) {
      const deletedNotification = await deleteNotification(id);
      return res.send(deletedNotification);
    }

    return res.status(ErrorCodes.Bad_Request).send('Unauthorized');
  },
  updateNotificationSeen: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const notifications = await updateNotificationSeen(authUser._id);
    return res.send(notifications);
  },
  updateMessagesNotificationSeen: async (req: Request, res: Response): Promise<any> => {
    const authUser = req.user as AuthUser;
    const { userId } = req.body;
    const notifications = await updateMessagesNotificationSeen(authUser._id, userId);
    return res.send(notifications);
  },
};

export default NotificationController;
