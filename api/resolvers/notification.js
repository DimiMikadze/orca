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
    const newNotification = await new Notification({
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
    const notification = await Notification.findByIdAndRemove(id);

    // Delete notification from users collection
    await User.findOneAndUpdate(
      { _id: notification.user },
      { $pull: { notifications: notification.id } }
    );

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

export default { Query, Mutation };
